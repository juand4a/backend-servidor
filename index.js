const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); 
const { sessionSecret } = require('./config');
require('dotenv').config();

const app = express();

// Middlewares

app.use(bodyParser.json({ limit: '300mb' }));
app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(cors()); 

// Rutas
const apiRouter = express.Router();
apiRouter.use('/colaborador', require('./routes/colaborador'));
apiRouter.use('/login', require('./routes/login'));
apiRouter.use('/entrada', require('./routes/asistencia'));
apiRouter.use('/foreingkey', require('./routes/foreingkeys'));
apiRouter.use('/anuncios', require('./routes/anuncios'));
apiRouter.use('/devolucion', require('./routes/devolucion'));
apiRouter.use('/encuesta', require('./routes/encuestaVehiculo'));
apiRouter.use('/colillas', require('./routes/colillas'));
apiRouter.use('/permisos', require('./routes/permisos'));
apiRouter.use('/interacciones', require('./routes/comentariosLikes'));
apiRouter.use('/ejecucionImpecable', require('./routes/negociosRoutes'));


// (y más rutas...)

app.use('/api', apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "hola" });
});

// Manejo de errores
app.use(require('./middlewares/ErrorMiddle'));

module.exports = app;
