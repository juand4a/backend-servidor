const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); // Importa la dependencia CORS
const sequelize = require('./models/database');

const app = express();
const port = 3000;

// Configuración de bodyParser para analizar los cuerpos de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

// Configuración de express-session
app.use(session({
  secret: 'mi-secreto',
  resave: true,
  saveUninitialized: true
}));

// Habilitar CORS
app.use(cors()); // Agrega este middleware para habilitar CORS

// Rutas
const colaboradorRoutes = require('./routes/colaborador');
const loginRoutes = require('./routes/login');
const entradaRoutes=require('./routes/asistencia');
const foreingkeys=require('./routes/foreingkeys');

app.use('/entrada', entradaRoutes)
app.use('/colaborador', colaboradorRoutes);
app.use('/login', loginRoutes);
app.use('/foreingkey',foreingkeys)

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
