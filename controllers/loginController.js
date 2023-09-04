const Colaborador = require('../models/colaborador');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { addToken, isTokenBlacklisted } = require('./blacklist');




// Inicio de sesión
exports.login = (req, res) => {
  const { correo, pw } = req.body;

  Colaborador.findOne({ where: { correo } })
    .then(colaborador => {
      if (!colaborador) {
        return res.status(404).json({ error: 'Correo electrónico no encontrado' });
      }

      if (bcrypt.compareSync(pw, colaborador.pw)) {
        const colaboradorData = colaborador.toJSON();
        delete colaboradorData.pw;


        const token = jwt.sign({ correo: colaborador.correo }, 'secretKey');

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
  const { token } = req.body;

  // Verificar si el token ya está en la blacklist
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'El token ya está inválido' });
  }

  // Si el token no está en la blacklist, agregarlo para invalidarlo
  addToken(token);
  res.json({ success: true, message: 'Se ha cerrado sesión correctamente' });
};
