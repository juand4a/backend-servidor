// services/authService.js

const Colaborador = require('../models/colaborador');
const Verificacion = require('../models/verificacion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { addToken, isTokenBlacklisted } = require('./../controllers/blacklist');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo');
const tipoSangre = require('../models/TipoSangre');
const tipoContrato = require('../models/TipoContrato');

const login = async (correo, pw) => {
  const colaborador = await Colaborador.findOne({
    where: { correo },
    include: [
      { model: Genero, attributes: ['genero'], as: 'genero_asociation' },
      { model: Cargo, attributes: ['cargo'], as: 'cargo_asociation' },
      { model: tipoSangre, attributes: ['grupoSanguineo'], as: 'tipoSangre_asociation' },
      { model: tipoContrato, attributes: ['tipoContrato'], as: 'tipoContrato_asociation' },
    ],
  });

  if (!colaborador) {
    throw new Error('Correo electrónico no encontrado');
  }

  const isMatch = await bcrypt.compare(pw, colaborador.pw);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  const token = jwt.sign({ correo: colaborador.correo }, 'secretKey');
  return { colaborador: colaborador.toJSON(), token };
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
