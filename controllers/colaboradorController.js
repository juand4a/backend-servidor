const Colaborador = require('../models/colaborador');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo')
const tipoSangre = require('../models/TipoSangre')
const Area = require('../models/Area')
const tipoContrato = require('../models/TipoContrato')
const sequelize = require('../config/database')
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Resto de tu código de controlador aquí

 const bcrypt = require('bcrypt');

// Obtener todos los colaboradores
exports.getAllColaboradores = (req, res) => {
  Colaborador.findAll({
    include: [
      {
        model: Genero,
        attributes: ['genero'],
        as: 'genero_asociation'
      },
      {
        model: Cargo,
        attributes: ['cargo', 'area'],
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
    .then(colaboradores => {
      res.json(colaboradores);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores' });
    });
};

// Obtener un colaborador por ID
exports.getColaboradorById = (req, res) => {
  const colaboradorId = req.params.id;

  Colaborador.findByPk(colaboradorId, {
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
        model: tipoContrato,
        attributes: ['tipoContrato'],
        as: 'tipoContrato_asociation'
      }

    ]
  })
    .then(colaborador => {
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json(colaborador);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener el colaborador' });
    });
};


// Crear un nuevo colaborador
exports.createColaborador = (req, res) => {
  const {
    documento,
    nombres,
    apellidos,
    genero,
    celular,
    fechaNacimiento,
    fechaIngreso,
    cargo,
    salario,
    ciudadNacimiento,
    ciudadResidencia,
    direccionResidencia,
    tipoContrato,
    correo,
    pw, // Cambiar el nombre de la variable para que no haya conflictos con la función
    estadoEmpleado,
    estadoCuenta,
    qrCodeUrl,
    fotoUrl,
    eps,
    afp,
    grupoSanguineo,
    estrato,
    estadoCivil,
    telefonoFijo,
    estatura,
    peso,
    celularCorporativo,
    portafolioId
  } = req.body;

  // Generar un salt y hashear la contraseña
  bcrypt.hash(pw, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al crear el colaborador' });
      return;
    }

    Colaborador.create({
      documento,
      nombres,
      apellidos,
      genero,
      celular,
      fechaNacimiento,
      fechaIngreso,
      cargo,
      salario,
      ciudadNacimiento,
      ciudadResidencia,
      direccionResidencia,
      tipoContrato,
      correo,
      pw: hashedPassword, // Usar la contraseña hasheada
      estadoEmpleado,
      estadoCuenta,
      qrCodeUrl,
      fotoUrl,
      jefeInmediato: null,
      eps,
      afp,
      grupoSanguineo,
      estrato,
      estadoCivil,
      telefonoFijo,
      estatura,
      peso,
      celularCorporativo,
      portafolioId

    })
      .then(colaborador => {
        const password = pw; // Guarda la contraseña antes de enviar el correo

        const transporter = nodemailer.createTransport({
          service: 'Gmail', // Puedes usar otro servicio o configurar uno propio
          auth: {
            user: 'jdlopez2013@misena.edu.co', // Tu dirección de correo
            pass: '3054576150Ju' // Tu contraseña
          }
        });

        const mailOptions = {
          from: 'jdlopez2013@misena.edu.co',
          to: colaborador.correo, // Correo del colaborador
          subject: 'Bienvenido a la empresa red de marcas,ya eres parte de la familia',
          text: `Usuario creado. Tu contraseña es: ${password} y ingresas con el correo que es ${colaborador.correo}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo: ' + error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
        });

        res.json({success: true,colaborador});
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al crear el colaborador' });
      });
  });
};

// Actualizar un colaborador
exports.updateColaborador = (req, res) => {
  const documentop = req.params.documento_colaborador
  const { nombres,
    apellidos,
    genero,
    celular,
    fechaNacimiento,
    fechaIngreso,
    salario,
    ciudadNacimiento,
    ciudadResidencia,
    direccionResidencia,
    correo,
    eps,
    afp,
    grupoSanguineo,
    estrato,
    estadoCivil,
    telefonoFijo,
    estatura,
    peso } = req.body;

  Colaborador.update({nombres,
    apellidos,
    genero,
    celular,
    fechaNacimiento,
    fechaIngreso,
    salario,
    ciudadNacimiento,
    ciudadResidencia,
    direccionResidencia,
    correo,
    eps,
    afp,
    grupoSanguineo,
    estrato,
    estadoCivil,
    telefonoFijo,
    estatura,
    peso }, { where: { documento: documentop, } })
    .then(result => {
      if (result[0] === 0) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
    });

};

// Eliminar un colaborador
exports.deleteColaborador = (req, res) => {
  const colaboradorId = req.params.id;

  Colaborador.destroy({ where: { id: colaboradorId } })
    .then(result => {
      if (result === 0) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json({ message: 'Colaborador eliminado correctamente' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al eliminar el colaborador' });
    });
};

exports.getAllColaboradoresByGenero = (req, res) => {
  const cargo = req.params.cargo; // Supongamos que obtienes el valor de cargo desde la solicitud.

  // Define un objeto que contiene la lógica de filtro basada en el valor de cargo.
  let whereClause = {};

  if (cargo === '8' || cargo === '1' || cargo === '2' || cargo === '4'|| cargo === '3') {
    whereClause = {};
  } else if (cargo === '16') {
    whereClause = {
      cargo: { [Op.or]: ['17', '18','19', '20','21', '22'] }
    };
  } else if (cargo === '10') {
    whereClause = {
      cargo: { [Op.or]: ['11', '12','13', '14','15'] }
    };
  }

  Colaborador.findAll({
    where: whereClause,
    attributes: [
      [sequelize.literal("SUM(CASE WHEN genero = '1' THEN 1 ELSE 0 END)"), 'masculino'],
      [sequelize.literal("SUM(CASE WHEN genero = '2' THEN 1 ELSE 0 END)"), 'femenino'],
      [sequelize.literal("SUM(CASE WHEN genero = '3' THEN 1 ELSE 0 END)"), 'lgbtq']
    ]
  })
    .then(result => {
      const totals = result[0].dataValues;
      res.json(totals);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener los totales de colaboradores por género' });
    });
};


exports.getAllColaboradoresTotal = (req, res) => {
  const cargo = req.params.cargo; // Supongamos que obtienes el valor de cargo desde la solicitud.

  // Define un objeto que contiene la lógica de filtro basada en el valor de cargo.
  let whereClause = {};
//admin
if (cargo === '8' || cargo === '1' || cargo === '2' || cargo === '4'|| cargo === '3') {
  whereClause = {};
    //ventas
  } else if (cargo === '16') {
    whereClause = {
      cargo: { [Op.or]: ['17', '18','19', '20','21', '22'] }
    };
    //logistico
  } else if (cargo === '10') {
    whereClause = {
      cargo: { [Op.or]: ['11', '12','13', '14','15'] }
    };
  }

  Colaborador.count({
    where: whereClause
  })
    .then(total => {
      res.json({ total });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener el total de colaboradores con la condición de cargo' });
    });
};

exports.getAllColaboradoresByCargo = (req, res) => {
  Colaborador.findAll({
    attributes: [
      [sequelize.literal("SUM(CASE WHEN cargo = '1' THEN 1 ELSE 0 END)"), 'GerenteGeneral'],
      [sequelize.literal("SUM(CASE WHEN cargo = '2' THEN 1 ELSE 0 END)"), 'Administrador'],
      [sequelize.literal("SUM(CASE WHEN cargo = '3' THEN 1 ELSE 0 END)"), 'AuxiliarAdministrativo'],
      [sequelize.literal("SUM(CASE WHEN cargo = '4' THEN 1 ELSE 0 END)"), 'CoordinadorLogístico'],
      [sequelize.literal("SUM(CASE WHEN cargo = '5' THEN 1 ELSE 0 END)"), 'AuxiliarLogístico'],
      [sequelize.literal("SUM(CASE WHEN cargo = '6' THEN 1 ELSE 0 END)"), 'ConductorEntregador'],
      [sequelize.literal("SUM(CASE WHEN cargo = '7' THEN 1 ELSE 0 END)"), 'Contador'],
      [sequelize.literal("SUM(CASE WHEN cargo = '8' THEN 1 ELSE 0 END)"), 'RevisorFiscal'],
      [sequelize.literal("SUM(CASE WHEN cargo = '9' THEN 1 ELSE 0 END)"), 'CoordinadordeVentas'],
      [sequelize.literal("SUM(CASE WHEN cargo = '10' THEN 1 ELSE 0 END)"), 'Asesorcomercial'],
      [sequelize.literal("SUM(CASE WHEN cargo = '11' THEN 1 ELSE 0 END)"), 'Aprendiz'],
      [sequelize.literal("SUM(CASE WHEN cargo = '12' THEN 1 ELSE 0 END)"), 'DesarrolladordeSoftware'],
      [sequelize.literal("SUM(CASE WHEN cargo = '14' THEN 1 ELSE 0 END)"), 'ServiciosCarnetización'],
      [sequelize.literal("SUM(CASE WHEN cargo = '15' THEN 1 ELSE 0 END)"), 'Psicologo']
    ]
  })
    .then(result => {
      const totals = result[0].dataValues;
      res.json(totals);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener los totales por género' });
    });
};

exports.getAllColaboradoresByAprendiz = (req, res) => {
  Colaborador.findAll({
    attributes: [
      [sequelize.literal("SUM(CASE WHEN cargo = '11' THEN 1 ELSE 0 END)"), 'Aprendiz']
    ]
  })
    .then(result => {
      const totals = result[0].dataValues;
      res.json(totals);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener los totales por género' });
    });
};





