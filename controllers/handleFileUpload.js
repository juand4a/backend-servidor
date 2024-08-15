const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { sequelize } = require('./../config/database'); // Asume que db.js está en el mismo directorio

const s3 = new AWS.S3();

async function handleFileUpload(file, documento_colaborador, id) {
    let finalPath;
    const localDestination = `c:/xampp/htdocs/fotos_entrada/${documento_colaborador}/`;
    if (!fs.existsSync(localDestination)) {
      fs.mkdirSync(localDestination, { recursive: true });
    }
    finalPath = path.join(localDestination, file.filename);
    fs.renameSync(file.path, finalPath);
  
    // Uso de Sequelize para insertar en la base de datos
    try {
      const sql = 'INSERT INTO imagenes_entrada (id_asistencia, foto, documento_colaborador, tipo_imagen, fecha) VALUES (?, ?, ?, ?, NOW())';
      await sequelize.query(sql, {
        replacements: [id, finalPath, documento_colaborador, 'entrada'],
        type: sequelize.QueryTypes.INSERT // Asegura que el tipo de consulta es de inserción
      });
      return finalPath; // Retorna la ruta final donde se almacenó el archivo
    } catch (error) {
      console.error('Error al insertar los datos en la base de datos:', error);
      throw error;
    }
  }
module.exports = { handleFileUpload };
