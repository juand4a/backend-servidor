// require("dotenv").config();

// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');

// // Función para asegurar que el directorio existe
// function ensureDirSync(dirPath) {
//   try {
//     if (!fs.existsSync(dirPath)) {
//       fs.mkdirSync(dirPath, { recursive: true });
//     }
//   } catch (err) {
//     console.error('Error al crear el directorio', err);
//   }
// }

// // Configuración de AWS SDK
// aws.config.update({
//   secretAccessKey: process.env.ACCESS_SECRET,
//   accessKeyId: process.env.ACCESS_KEY,
//   region: process.env.REGION,
// });

// const s3 = new aws.S3();

// // Función para limpiar y asegurar nombres de archivos seguros
// function sanitizeFilename(filename) {
//   return filename.replace(/[^a-zA-Z0-9-_\.]/g, ''); // Remueve caracteres no deseados, pero permite puntos para extensiones
// }

// // Configuración de almacenamiento local para desarrollo
// const storageDev = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const docPath = path.join('C:', 'xampp', 'htdocs', 'files_intranet', 'asistencia_entrada', req.body.documento_colaborador);
//     ensureDirSync(docPath);
//     cb(null, docPath);
//   },
//   filename: function (req, file, cb) {
//     const sanitizedFilename = sanitizeFilename(file.originalname); // Mantiene el nombre original sanitizado
//     cb(null, sanitizedFilename);
//   }
// });

// // Configuración de almacenamiento de Multer para S3 en producción
// const storageProd = multerS3({
//   s3: s3,
//   bucket: process.env.BUCKET_NAME,
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key: function (req, file, cb) {
//     const documentFolder = `asistencia_entrada/${req.body.documento_colaborador}`;
//     const sanitizedFilename = sanitizeFilename(file.originalname); // Mantiene el nombre original sanitizado
//     cb(null, `${documentFolder}/${sanitizedFilename}`);
//   }
// });

// // Selección del almacenamiento según el entorno
// const storage = process.env.NODE_ENV === 'production' ? storageProd : storageDev;

// const upload = multer({ storage: storage });

// module.exports = upload;
