const Colaborador = require('../models/colaborador');
const Genero = require('../models/Genero');
const Cargo = require('../models/Cargo')
const tipoSangre = require('../models/TipoSangre')
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
        attributes: ['cargo'],
        as: 'cargo_asociation'
      },
      {
        model: tipoSangre,
        attributes: ['grupoSanguineo'],
        as: 'tipoSangre_asociation'
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
    peso
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
      peso
    })
      .then(colaborador => {
        res.json(colaborador);
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
