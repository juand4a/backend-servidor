const Colaborador = require('../models/colaborador');
const jwt = require('jsonwebtoken');
const { addToken, isTokenBlacklisted } = require('./blacklist');
const bcrypt=require('bcrypt')
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo')
const tipoSangre = require('../models/TipoSangre')
const tipoContrato = require('../models/TipoContrato')

// Inicio de sesión
// exports.login = (req, res) => {
//   const { correo, pw } = req.body;
//   console.log('Correo:', correo);
//   console.log('Contraseña:', pw);
//   Colaborador.findOne({ 
//     where: { correo },
//     include: [
//       {
//         model: Genero,
//         attributes: ['genero'],
//         as: 'genero_asociation'
//       },
//       {
//         model: Cargo,
//         attributes: ['cargo'],
//         as: 'cargo_asociation'
//       },
//       {
//         model: tipoSangre,
//         attributes: ['grupoSanguineo'],
//         as: 'tipoSangre_asociation'
//       },
//       {
//         model: tipoContrato,
//         attributes: ['tipoContrato'],
//         as: 'tipoContrato_asociation'
//       }
//     ]
//   })
//   .then(colaborador => {
//     if (!colaborador) {
//       return res.status(404).json({ error: 'Correo electrónico no encontrado' });
//     }
//     let isPasswordValid = false;

//     // Verificar si la contraseña proporcionada es una contraseña encriptada con prefijo "$2a$"
//     if (pw.startsWith('$2a$')) {
//       // La contraseña proporcionada es una contraseña encriptada
//       isPasswordValid = (pw === colaborador.pw);
//     } else {
//       // La contraseña proporcionada es una contraseña en texto plano
//       isPasswordValid = bcrypt.compareSync(pw, colaborador.pw);
//     }
    
//     if (isPasswordValid) {
//       const colaboradorData = colaborador.toJSON();
  
//       const token = jwt.sign({ correo: colaborador.correo }, 'secretKey');
//       res.json({
//         success: true,
//         colaborador: colaboradorData,
//         token
//       });
//       console.log(token);
//     } else {
//       res.status(401).json({ error: 'Contraseña incorrecta' });
//     }
//   })
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
//   });
// }
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
  
    let isPasswordValid = false;

    // Verificar si la contraseña proporcionada es encriptada
    if (pw.startsWith('ENCRYPTED:')) {
      // La contraseña proporcionada es encriptada
      const encryptedPassword = pw.substring('ENCRYPTED:'.length);
      isPasswordValid = bcrypt.compareSync(encryptedPassword, colaborador.pw);
    } else {
      // La contraseña proporcionada es en texto plano
      isPasswordValid = bcrypt.compareSync(pw, colaborador.pw);
    }
    
    if (isPasswordValid) {
      const colaboradorData = colaborador.toJSON();
  
      const token = jwt.sign({ correo: colaborador.correo }, 'secretKey');
      res.json({
        success: true,
        colaborador: colaboradorData,
        token
      });
      console.log(token);

    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al iniciar sesión' });
  });
}

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
