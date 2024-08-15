require("dotenv").config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

// Función para asegurar que el directorio existe
function ensureDirSync(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });  // recursive: true permite crear directorios anidados
    }
  } catch (err) {
    console.error('Error al crear el directorio', err);
  }
}

// Configuración de AWS SDK
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
});

const s3 = new aws.S3();

// Configuración de almacenamiento local para desarrollo
const storageDev = multer.diskStorage({
  destination: function (req, file, cb) {
    const docPath = path.join('C:', 'xampp', 'htdocs', 'files_intranet', 'asistencia_salida', req.params.documento_colaborador);
    ensureDirSync(docPath);
    cb(null, docPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
  }
});

// Configuración de almacenamiento de Multer para S3 en producción
const storageProd = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const documentFolder = 'asistencia_salida/' + req.params.documento_colaborador;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, documentFolder + '/' + file.originalname + '-' + uniqueSuffix + '.png');
  }
});

// Selección del almacenamiento según el entorno
const storage = process.env.NODE_ENV === 'production' ? storageProd : storageDev;

const uploadS = multer({ storage: storage });
module.exports = uploadS;
