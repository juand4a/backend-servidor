const Colaborador = require('../models/colaborador');
const Verificacion = require('../models/verificacion');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { addToken, isTokenBlacklisted } = require('./blacklist');
const bcrypt=require('bcrypt')
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo')
const tipoSangre = require('../models/TipoSangre')
const tipoContrato = require('../models/TipoContrato')

// Inicio de sesión
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

    // Verificar si la contraseña proporcionada es una contraseña encriptada con prefijo "$2a$"
    if (pw.startsWith('$2a$')) {
      // La contraseña proporcionada es una contraseña encriptada
      isPasswordValid = (pw === colaborador.pw);
    } else {
      // La contraseña proporcionada es una contraseña en texto plano
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



exports.sendCodeByEmail = (req, res) => {
  const { correo } = req.body;

  // Generar un código de 8 dígitos
  const code = Math.floor(10000000 + Math.random() * 90000000);

  // Enviar el código por correo electrónico
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Cambia esto a tu proveedor de correo
    auth: {
      user: 'jdlopez2013@misena.edu.co', // Cambia esto a tu dirección de correo
      pass: '3054576150Ju' // Cambia esto a tu contraseña de correo
    }
  });

  const mailOptions = {
    from: 'jdlopez2013@misena.edu.co', // Cambia esto a tu dirección de correo
    to: correo,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error al enviar el código por correo electrónico' });
    }


    // Asegúrate de que los nombres de los campos en tu modelo de base de datos sean los correctos
    Verificacion.create({
      correo: correo,
      codigo: code
    })
      .then(() => {
        res.json({ success: true, message: 'Código enviado  correctamente' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error' });
      });
  });
}

exports.verifyCode = (req, res) => {
  const { codigo } = req.body;

  // Buscar en la base de datos si existe un registro con el código proporcionado
  Verificacion.findOne({ where: { codigo } })
    .then(verificacion => {
      if (!verificacion) {
        return res.status(404).json({ error: 'Código no válido' });
      }

      verificacion.destroy()
        .then(() => {
          res.json({ success: true, message: 'Código válido' });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Error al procesar el código' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al buscar el código en la base de datos' });
    });
}

exports.updatePassword = (req, res) => {
  const { documento, nuevaContrasena } = req.body;

  Colaborador.findOne({ where: { documento } })
    .then((colaborador) => {
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }

      // Generar un hash para la nueva contraseña
      const hashedPassword = bcrypt.hashSync(nuevaContrasena, 10);

      // Actualizar la contraseña en la base de datos
      colaborador.update({ pw: hashedPassword })
        .then(() => {
          res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
        })
        .catch((updateErr) => {
          console.error(updateErr);
          res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña' });
    });
};



