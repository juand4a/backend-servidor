// controllers/authController.js

const authService = require('../service/authService');
const Colaborador = require('../models/colaborador');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo');
const tipoSangre = require('../models/TipoSangre');
const tipoContrato = require('../models/TipoContrato');
// controllers/authController.js
const { addToken, isTokenBlacklisted } = require('./../controllers/blacklist');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { correo, pw } = req.body;
  console.log('Correo:', correo);
  console.log('Contraseña:', pw);

  Colaborador.findOne({
    where: { correo },
    include: [
      {
        model: Genero,
        attributes: ['genero'],
        as: 'genero_asociation'
      },
      {
        model: Cargo,
        attributes: ['cargo'],
        as: 'cargo_asociation'
      },
      {
        model: tipoSangre,
        attributes: ['grupoSanguineo'],
        as: 'tipoSangre_asociation'
      },
      {
        model: tipoContrato,
        attributes: ['tipoContrato'],
        as: 'tipoContrato_asociation'
      }
    ]
  })
  .then(colaborador => {
    if (!colaborador) {
      return res.status(404).json({ error: 'Correo electrónico no encontrado' });
    }

    // Verificación directa de la contraseña sin usar bcrypt
    if (pw === colaborador.pw) {
      const colaboradorData = colaborador.toJSON();
      const token = jwt.sign({ correo: colaborador.correo }, 'secretKey', { expiresIn: '1h' });
      res.json({
        success: true,
        colaborador: colaboradorData,
        token
      });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
  });
};



exports.logout = (req, res) => {
  try {
    const { token } = req.body;
    authService.logout(token);
    res.json({ success: true, message: 'Se ha cerrado sesión correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    res.status(401).json({ error: error.message });
  }
};

exports.sendCodeByEmail = async (req, res) => {
  try {
    const { correo } = req.body;
    await authService.sendVerificationCode(correo);
    res.json({ success: true, message: 'Código enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el código por correo electrónico:', error.message);
    res.status(500).json({ error: 'Error al enviar el código por correo electrónico' });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { codigo } = req.body;
    await authService.verifyCode(codigo);
    res.json({ success: true, message: 'Código válido' });
  } catch (error) {
    console.error('Error al verificar el código:', error.message);
    res.status(404).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { documento, nuevaContrasena } = req.body;
    await authService.updatePassword(documento, nuevaContrasena);
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error.message);
    res.status(500).json({ error: error.message });
  }
};
