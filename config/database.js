const { Sequelize } = require('sequelize');

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize('reddemarcas_db', 'admin', 'Lucia290820*', {
  host: 'reddemarcasdb.cr48gy6omv0v.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  logging: console.log,
});
// const sequelize = new Sequelize('redm_dev', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   port: 3307, // Aquí se especifica el puerto
//   logging: console.log,
// });

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

