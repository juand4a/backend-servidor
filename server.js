const app = require('./index');
const { port } = require('./config');
const serverless = require('serverless-http');
// app.listen(port, () => {
//   console.log(`Servidor en funcionamiento en el puerto ${port}`);
// });

module.exports.handler = serverless(app);
