// services/authService.js

const Colaborador = require('../models/colaborador');
const Verificacion = require('../models/verificacion');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { addToken, isTokenBlacklisted } = require('./../controllers/blacklist');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo');
const tipoSangre = require('../models/TipoSangre');
const tipoContrato = require('../models/TipoContrato');

const login = async (email, pw) => {
  try {
    const user = await Colaborador.findOne({
      where: { correo: email },
      attributes: ['correo', 'pw'], // Solo los campos necesarios para la autenticación
    });

    if (!user) {
      return { error: 'Usuario no encontrado', status: 401 };
    }

    // Compara la contraseña proporcionada con la almacenada (sin usar bcrypt)
    if (pw !== user.pw) {
      return { error: 'Contraseña incorrecta', status: 401 };
    }

    // Genera el token con información mínima necesaria
    const token = jwt.sign({ email: user.correo }, 'secretKey', { expiresIn: '1h' });
    return { user: { email: user.correo }, token };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { error: 'Error interno del servidor', status: 500 };
  }
};


const logout = (token) => {
  if (isTokenBlacklisted(token)) {
    throw new Error('El token ya está inválido');
  }
  addToken(token);
};

const sendVerificationCode = async (correo) => {
  const code = Math.floor(10000000 + Math.random() * 90000000);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jdlopez2013@misena.edu.co',
      pass: '3054576150Ju',
    },
  });

  const mailOptions = {
    from: 'jdlopez2013@misena.edu.co',
    to: correo,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`,
  };

  await transporter.sendMail(mailOptions);
  await Verificacion.create({ correo, codigo: code });
};

const verifyCode = async (codigo) => {
  const verificacion = await Verificacion.findOne({ where: { codigo } });
  if (!verificacion) {
    throw new Error('Código no válido');
  }
  await verificacion.destroy();
};

const updatePassword = async (documento, nuevaContrasena) => {
  const colaborador = await Colaborador.findOne({ where: { documento } });
  if (!colaborador) {
    throw new Error('Colaborador no encontrado');
  }

  const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
  await colaborador.update({ pw: hashedPassword });
};

module.exports = {
  login,
  logout,
  sendVerificationCode,
  verifyCode,
  updatePassword,
};
