const { Sequelize } = require('sequelize');

// Configuración de la conexión a la base de datos
// const sequelize = new Sequelize('reddemarcas_db', 'admin', 'Lucia290820*', {
//   host: 'reddemarcasdb.cr48gy6omv0v.us-east-1.rds.amazonaws.com',
//   dialect: 'mysql',
//   logging: false, 
// });
const sequelize = new Sequelize('rdm_general_dev', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

// Probar la conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;

