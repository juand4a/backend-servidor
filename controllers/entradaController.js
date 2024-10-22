// controllers/entradaController.js

const entradaService = require('../service/entradaService');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // Importar los nuevos componentes
const isProduction = process.env.NODE_ENV === 'production'; // Verifica si estamos en producción o desarrollo

// Configuración de AWS S3
let s3Client;
if (isProduction) {
  s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_SECRET
    }
  });
}

// Función para subir archivo a S3 en producción
const uploadToS3 = async (filePath, fileName, documentFolder) => {
  if (!isProduction) return null; // No sube a S3 si no es producción

  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${documentFolder}/${fileName}`, // Guardar en la carpeta específica
    Body: fileContent,
    ContentType: 'image/jpeg', // Ajusta según el tipo de imagen
  };

  // Utilizar la nueva API para subir el archivo
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    const location = `https://${params.Bucket}.s3.${process.env.REGION}.amazonaws.com/${params.Key}`;
    return { Location: location };
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
    }
  } catch (err) {
    console.error('Error al crear el directorio', err);
    throw err; // Re-lanzar el error para manejarlo en el controlador
  }
}

// Guardar archivo localmente en modo desarrollo
const saveLocalFile = (filePath, buffer) => {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

// Controlador para crear una entrada con foto de entrada
exports.createEntrada = async (req, res) => {
  try {
    const { documento_colaborador, foto_base64 } = req.body;

    if (!foto_base64) {
      return res.status(400).json({ error: 'No se proporcionó una imagen de entrada' });
    }

    // Decodificar imagen base64 y guardar temporalmente
    const buffer = Buffer.from(foto_base64, 'base64');
    let tempFilePath;

    if (isProduction) {
      const tempDirPath = path.join('/tmp', 'temp', documento_colaborador);
      ensureDirSync(tempDirPath);
      tempFilePath = path.join(tempDirPath, `temp_image_entrada.jpeg`);
      fs.writeFileSync(tempFilePath, buffer);
    } else {
      const localDirPath = path.join('C:/xampp/htdocs/files-redm', documento_colaborador);
      tempFilePath = path.join(localDirPath, `foto_entrada_${documento_colaborador}_${Date.now()}.jpeg`);
      saveLocalFile(tempFilePath, buffer);
    }

    let imageUrl;
    if (isProduction) {
      const documentFolder = `asistencia_entrada/${documento_colaborador}`;
      const sanitizedFilename = `foto_entrada_${documento_colaborador}_${Date.now()}.jpeg`;
      const s3Response = await uploadToS3(tempFilePath, sanitizedFilename, documentFolder);
      imageUrl = s3Response.Location;
      fs.unlinkSync(tempFilePath);
    } else {
      imageUrl = tempFilePath;
    }

    const entradaData = {
      ...req.body,
      foto_entrada: imageUrl,
    };

    const encuestasData = {
      partesEncuestaVehiculo: entradaData.partesEncuestaVehiculo,
      papelesEncuestaVehiculo: entradaData.papelesEncuestaVehiculo,
      herramientasEncuestaVehiculo: entradaData.herramientasEncuestaVehiculo,
      nivelesEncuestaVehiculo: entradaData.nivelesEncuestaVehiculo,
      elementosProteccionEncuesta: entradaData.elementosProteccionEncuesta, // Nueva encuesta
    };

    const result = await entradaService.createEntrada(entradaData, encuestasData);

    res.json({
      success: true,
      entradaId: result.nuevaEntrada.id,
      foto_entrada: entradaData.foto_entrada,
    });
  } catch (error) {
    console.error('Error al guardar la entrada:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};


// Controlador para actualizar una entrada con foto de salida
exports.updateEntrada = async (req, res) => {
  try {
    const { documento_colaborador, fecha } = req.params;
    const { foto_base64 } = req.body;

    if (!foto_base64) {
      return res.status(400).json({ error: 'No se proporcionó una imagen de salida' });
    }

    // Decodificar imagen base64 y guardar temporalmente en /tmp o local
    const buffer = Buffer.from(foto_base64, 'base64');
    let tempFilePath;

    if (isProduction) {
      // Si está en producción, usa la carpeta temporal de /tmp
      const tempDirPath = path.join('/tmp', 'temp', documento_colaborador);
      ensureDirSync(tempDirPath);
      tempFilePath = path.join(tempDirPath, `temp_image_salida.jpeg`);
      fs.writeFileSync(tempFilePath, buffer);
    } else {
      // Si está en desarrollo, guarda en htdocs/files-redm
      const localDirPath = path.join('C:/xampp/htdocs/files-redm', documento_colaborador);
      tempFilePath = path.join(localDirPath, `foto_salida_${documento_colaborador}_${Date.now()}.jpeg`);
      saveLocalFile(tempFilePath, buffer);
    }

    // Si estamos en producción, subimos a S3, de lo contrario mantenemos la ruta local
    let imageUrl;
    if (isProduction) {
      const documentFolder = `asistencia_salida/${documento_colaborador}`;
      const sanitizedFilename = `foto_salida_${documento_colaborador}_${Date.now()}.jpeg`;
      const s3Response = await uploadToS3(tempFilePath, sanitizedFilename, documentFolder);
      imageUrl = s3Response.Location;
      fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal después de subir
    } else {
      imageUrl = tempFilePath; // Guardamos la ruta local
    }

    // Crear los datos de actualización con la URL de la imagen
    const updateData = {
      ...req.body,
      foto_salida: imageUrl, // URL de la imagen local o S3
    };

    const updatedRows = await entradaService.updateEntrada(documento_colaborador, fecha, updateData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Colaborador no encontrado o la fecha no coincide' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar la entrada:', err);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
  }
};


exports.getAllEntrada = async (req, res) => {
  try {
    const entradas = await entradaService.getAllEntradas();
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
  }
};

exports.getEntradaByDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const entradas = await entradaService.getEntradaByDocumento(documento);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento especificado' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento' });
  }
};

exports.getEntradaByDocumentoYFecha = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const entradas = await entradaService.getEntradaByDocumentoYFecha(documento, fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento y la fecha especificados' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento y fecha:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y fecha' });
  }
};

exports.getEntradasByMonth = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const entradas = await entradaService.getEntradasByMonth(documento, fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para el documento y el mes especificados' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por documento y mes:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por documento y mes' });
  }
};

exports.getEntradaByFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const entradas = await entradaService.getEntradaByFecha(fecha);

    if (entradas.length === 0) {
      return res.status(404).json({ error: 'No se encontraron entradas para la fecha especificada' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por fecha:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha' });
  }
};

exports.getEntrada = async (req, res) => {
  try {
    const { fecha,cargo } = req.params;

    // Validar si el cargo está permitido para ver asistencias
    const cargosPermitidos = ['1', '2', '3', '4', '5', '8', '10', '16'];
    if (!cargosPermitidos.includes(cargo)) {
      return res.status(403).json({ error: 'No tienes acceso para ver las asistencias.' });
    }

    const entradas = await entradaService.getEntrada(fecha, cargo);

    if (!entradas.length) {
      return res.status(404).json({ error: 'No se encontraron entradas para la fecha especificada' });
    }
    res.json(entradas);
  } catch (err) {
    console.error('Error al obtener las entradas por fecha:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las entradas por fecha' });
  }
};


exports.getEntradasByMonthEstadistica = async (req, res) => {
  try {
    const { documento, fecha } = req.params;
    const estadisticas = await entradaService.getEntradasByMonthEstadistica(documento, fecha);

    res.json(estadisticas);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las estadísticas' });
  }
};

exports.getTopLateEntrants = async (req, res) => {
  try {
    const topLateEntrants = await entradaService.getTopLateEntrants();
    res.json(topLateEntrants);
  } catch (err) {
    console.error('Error al obtener las personas con más entradas tardías:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener las personas con más entradas tardías' });
  }
};
