const Colaborador = require('../models/colaborador');
const Genero = require('../models/Genero');
const Cargo=require('../models/Cargo')

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
  const { correo, pw, nombres, apellidos } = req.body;

  Colaborador.create({ correo, pw, nombres, apellidos })
    .then(colaborador => {
      res.json(colaborador);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al crear el colaborador' });
    });
};

// Actualizar un colaborador
exports.updateColaborador = (req, res) => {
  const colaboradorId = req.params.id;
  const { correo, pw, nombres, apellidos } = req.body;

  Colaborador.update({ correo, pw, nombres, apellidos }, { where: { id: colaboradorId } })
    .then(result => {
      if (result[0] === 0) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json({ message: 'Colaborador actualizado correctamente' });
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
