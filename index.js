const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); 
const helmet = require('helmet');
const compression = require('compression');
const { sessionSecret } = require('./config');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(compression());
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
// (y más rutas...)

app.use('/api', apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ mensaje: "hola" });
});

// Manejo de errores
app.use(require('./middlewares/ErrorMiddle'));

module.exports = app;
