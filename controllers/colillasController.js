const pdfParse = require('pdf-parse');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const Colillas = require('../models/colillaspagocolaborador');

// Configuración de AWS S3
const isProduction = process.env.NODE_ENV === 'production';

let s3Client;
if (isProduction) {
  s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_SECRET,
    },
  });
}

// Función para subir archivo a S3 en producción
const uploadToS3 = async (pdfBytes, fileName, documentFolder) => {
  if (!isProduction) return null;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${documentFolder}/${fileName}`,
    Body: pdfBytes,
    ContentType: 'application/pdf',
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      const location = `https://${params.Bucket}.s3.${process.env.REGION}.amazonaws.com/${params.Key}`;
      return { Location: location };
    }
    throw new Error('Error al subir el archivo a S3');
  } catch (error) {
    console.error('Error al subir a S3:', error);
    throw error;
  }
};

// Función para asegurar que el directorio existe localmente
function ensureDirSync(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directorio creado: ${dirPath}`);
    }
  } catch (err) {
    console.error('Error al crear el directorio', err);
    throw err;
  }
}

// Función para extraer el ID del texto del PDF
function extractID(text) {
  const idRegex = /\b\d{10}\b/;
  const match = text.match(idRegex);
  return match && match[0];
}

// Función para guardar las páginas del PDF sin ninguna validación
async function savePdfPagesWithoutValidation(base64Pdf, outputDirectory, fechaSubida) {
  try {
    const pdfData = Buffer.from(base64Pdf, 'base64');
    const pdfDoc = await PDFDocument.load(pdfData);
    const totalPages = pdfDoc.getPageCount();

    if (!isProduction) {
      ensureDirSync(outputDirectory);
    }

    const pdfFiles = [];
    for (let i = 0; i < totalPages; i++) {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);

      const fileName = `colilla_page_${i + 1}.pdf`;
      const pdfBytes = await newPdfDoc.save();

      if (isProduction) {
        const documentFolder = `colillas/${fechaSubida}`;
        const fileUrl = await uploadToS3(pdfBytes, fileName, documentFolder);
        pdfFiles.push({ filePath: fileUrl.Location, fileName });
      } else {
        const filePath = path.join(outputDirectory, fileName);
        fs.writeFileSync(filePath, pdfBytes);
        pdfFiles.push({ filePath, fileName });
      }
    }

    return pdfFiles;
  } catch (error) {
    console.error('Error al guardar las páginas del PDF:', error);
    throw error;
  }
}

// Función para procesar cada PDF ya separado y registrar en la base de datos
async function processSeparatedPdfsAndRegisterInDB(pdfFiles, fechaSubida) {
  try {
    for (const pdfFile of pdfFiles) {
      let pdfData;

      if (isProduction) {
        try {
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: pdfFile.filePath.split(`https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/`)[1],
          };
          const response = await s3Client.send(new GetObjectCommand(getObjectParams));
          pdfData = await response.Body.transformToByteArray();
        } catch (error) {
          console.error(`Error al descargar ${pdfFile.filePath} de S3:`, error);
          continue;
        }
      } else {
        pdfData = fs.readFileSync(pdfFile.filePath);
      }

      const parsedPdf = await pdfParse(pdfData);
      const docid = extractID(parsedPdf.text);

      if (docid) {
        await Colillas.create({
          docid: docid,
          url: pdfFile.filePath,
          fechaSubida: new Date(fechaSubida),
          fechaPago: new Date(),
        });

        console.log(`Procesado el archivo ${pdfFile.fileName} con docid ${docid}`);
      } else {
        console.warn(`No se encontró C.C. en el archivo ${pdfFile.fileName}`);
      }
    }

    return `Se procesaron y registraron ${pdfFiles.length} archivos PDF correctamente.`;
  } catch (error) {
    console.error('Error al procesar los archivos PDF:', error);
    throw error;
  }
}

// Controlador para manejar el PDF y procesar sus páginas
exports.createColillasForAllColaboradores = async (req, res) => {
  const { pdfBase64, fechaSubida } = req.body;
  const outputDirectory = path.join('C:/xampp/htdocs/files-redm/colillas', fechaSubida);

  try {
    const pdfFiles = await savePdfPagesWithoutValidation(pdfBase64, outputDirectory, fechaSubida);
    await processSeparatedPdfsAndRegisterInDB(pdfFiles, fechaSubida);
    res.json({ message: 'Los archivos PDF se han procesado y registrado correctamente.' });
  } catch (error) {
    console.error('Error al procesar las colillas:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar los archivos PDF.' });
  }
};

// Controlador para obtener las colillas por `docid`
exports.getColillasByDocid = async (req, res) => {
  const { docid } = req.params;

  try {
    const colillas = await Colillas.findAll({ where: { docid: docid } });

    if (colillas.length > 0) {
      res.json(colillas);
    } else {
      res.status(404).json({ message: 'No se encontraron colillas para este docid.' });
    }
  } catch (error) {
    console.error('Error al obtener las colillas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las colillas.' });
  }
};
