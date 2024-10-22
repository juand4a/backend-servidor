// controllers/anunciosController.js

const anunciosService = require('./../service/anunciosService');
const Anuncio = require('./../models/anuncios');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const isProduction = process.env.NODE_ENV === 'production'; // Verifica si es producción

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

// Controlador para crear un anuncio
// Controlador para crear un anuncio
exports.createAnuncio = async (req, res) => {
  const {
    titulo,
    contenido,
    fechaPublicacion,
    foto_base64,  // Recibe la imagen en base64
    tipoAnuncio,
  } = req.body;

  // Validación de los campos requeridos
  if (!titulo || !contenido || !fechaPublicacion || !tipoAnuncio) {
    return res.status(400).json({
      error: 'Todos los campos (título, contenido, fecha de publicación, tipo de anuncio) son obligatorios',
    });
  }

  if (!foto_base64) {
    return res.status(400).json({ error: 'No se proporcionó una imagen de entrada' });
  }

  // Decodificar imagen base64 y guardar temporalmente en /tmp o localmente
  const buffer = Buffer.from(foto_base64, 'base64');
  let tempFilePath;

  if (isProduction) {
    // Si está en producción, usa la carpeta temporal de /tmp
    const tempDirPath = path.join('/tmp', 'temp', 'anuncios');
    ensureDirSync(tempDirPath);
    tempFilePath = path.join(tempDirPath, `anuncio_${Date.now()}.jpeg`);
    fs.writeFileSync(tempFilePath, buffer);
  } else {
    // Si está en desarrollo, guarda en htdocs/files-redm
    const localDirPath = path.join('C:/xampp/htdocs/files-redm/anuncios');
    tempFilePath = path.join(localDirPath, `anuncio_${Date.now()}.jpeg`);
    saveLocalFile(tempFilePath, buffer);
  }

  // Si estamos en producción, subimos a S3, de lo contrario mantenemos la ruta local
  let imageUrl;
  if (isProduction) {
    const documentFolder = `anuncios`;
    const sanitizedFilename = `anuncio_${Date.now()}.jpeg`;
    const s3Response = await uploadToS3(tempFilePath, sanitizedFilename, documentFolder);
    imageUrl = s3Response.Location;
    fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal después de subir
  } else {
    imageUrl = tempFilePath; // Guardamos la ruta local
  }

  try {
    // Crear el anuncio en la base de datos
    const anuncio = await Anuncio.create({
      titulo,
      contenido,
      fechaPublicacion,
      foto: imageUrl, // Guardar la URL o ruta local de la foto
      tipoAnuncio,
    });

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncio Creado Correctamente',
      data: anuncio,
    });
  } catch (err) {
    console.error('Error al crear el anuncio:', err);
    res.status(500).json({ error: 'Ocurrió un error al crear el anuncio' });
  }
};

exports.getAllAnunciosNuevosIngresos = async (req, res) => {
  try {
    const anunciosNuevosIngresos = await anunciosService.getAllAnunciosNuevosIngresos();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncios de Nuevos Ingresos Obtenidos Correctamente',
      data: anunciosNuevosIngresos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios de nuevos ingresos' });
  }
};
exports.getAllAnunciosAniversariosIngreso = async (req, res) => {
  try {
    const anunciosAniversariosIngreso = await anunciosService.getAllAnunciosAniversariosIngreso();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncios de Aniversario de Ingreso Obtenidos Correctamente',
      data: anunciosAniversariosIngreso
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios de aniversario de ingreso' });
  }
};

exports.getAllAnunciosCumpleaños = async (req, res) => {
  try {
    const anunciosCumpleaños = await anunciosService.getAllAnunciosCumpleaños();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncios de Cumpleaños Obtenidos Correctamente',
      data: anunciosCumpleaños
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios de cumpleaños' });
  }
};

exports.getAllAnuncios = async (req, res) => {
  try {
    const anuncios = await anunciosService.getAllAnuncios();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncio Obtenidos Correctamente',
      data: anuncios
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios' });
  }
};
