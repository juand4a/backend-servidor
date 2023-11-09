const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); 
const serverless = require('serverless-http');


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
app.use(cors()); 

// Rutas
const colaboradorRoutes = require('./routes/colaborador');
const loginRoutes = require('./routes/login');
const entradaRoutes=require('./routes/asistencia');
const foreingkeys=require('./routes/foreingkeys');
const productos=require('./routes/productos')
const anuncios=require('./routes/anuncios')
const colillas=require('./routes/colillas')
const permisos=require('./routes/permisos')
const capacitacion=require('./routes/capacitacion')
const likesComentarios=require('./routes/comentariosLikes')
const incapacidad=require('./routes/incapacidad')

app.get("/",(req,res)=>{
  res.status(5).json({mensaje:"hola"})
})
app.use('/entrada', entradaRoutes)
app.use('/colaborador', colaboradorRoutes);
app.use('/login', loginRoutes);
app.use('/foreingkey',foreingkeys)
app.use('/productos',productos)
app.use('/anuncio',anuncios)
app.use('/colilla',colillas)
app.use('/permisos',permisos)
app.use('/capacitacion',capacitacion)
app.use('/likesComentarios',likesComentarios)
app.use('/incapacidad',incapacidad)
// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});

// module.exports.handler = serverless(app);