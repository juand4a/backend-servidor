const Entrada = require('../models/entrada');
const PartesEncuestaVehiculo = require('../models/partesencuestavehiculo');
const PapelesEncuestaVehiculo = require('../models/papelesencuestavehiculo'); // Asegúrate de que la ruta del archivo sea correcta
const HerramientasEncuestaVehiculo=require('../models/herramientasencuestavehiculo');
const NivelesEncuestaVehiculo=require('../models/nivelesencuestavehiculo');

// Obtener todos los colaboradores
exports.getAllEntrada = (req, res) => {
  Entrada.findAll()
    .then(entrada => {
      res.json(entrada);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
    });
};

// Obtener un colaborador por ID
exports.getEntradaById = (req, res) => {
  const entradaId = req.params.id;

  Entrada.findByPk(entradaId)
    .then(entrada => {
      if (!entrada) {
        return res.status(404).json({ error: 'entrada no encontrado' });
      }
      res.json(entrada);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener la entrada' });
    });
};

// Crear un nueva entrada
// controllers.js
exports.createEntrada = async (req, res) => {
  const {
    documento_colaborador,
    fecha,
    entrada,
    salida,
    cliente,
    kilometraje,
    placa,
    tipo_vehiculo,
   partesEncuestaVehiculo,
    papelesEncuestaVehiculo,
    herramientasEncuestaVehiculo,
    nivelesEncuestaVehiculo,
  } = req.body;

  try {
    // Crear la entrada
    const nuevaEntrada = await Entrada.create({
      documento_colaborador,
      fecha,
      entrada,
      salida,
      cliente,
      kilometraje,
      placa,
      tipo_vehiculo,
    });

    // Guardar las partes de la encuesta del vehículo
    if (!Array.isArray(papelesEncuestaVehiculo)) {
      // Manejo del error o muestra un mensaje de error adecuado
      console.error('papelesEncuestaVehiculo no es un array válido.');
      // Aquí puedes enviar una respuesta de error apropiada para el cliente
      return res.status(400).json({ error: 'papelesEncuestaVehiculo no es un array válido.' });
    }
    const partesEncuestaGuardadas = await PartesEncuestaVehiculo.bulkCreate(
      partesEncuestaVehiculo.map((partes) => ({
        idEncuesta: nuevaEntrada.id,
        idParteVehiculo: partes.idParteVehiculo,
        estado: partes.estado,
      }))
    );

    const herramientasEncuestaGuardadas=await HerramientasEncuestaVehiculo.bulkCreate(
      herramientasEncuestaVehiculo.map((herramienta)=>({
         idEncuesta:nuevaEntrada.id,
         idHerramientaVehiculo:herramienta.idHerramientaVehiculo,
         verificado:herramienta.verificado
      }))
    )
    const nivelesEncuestaGuardadas=await NivelesEncuestaVehiculo.bulkCreate(
      nivelesEncuestaVehiculo.map((herramienta)=>({
         idEncuesta:nuevaEntrada.id,
         idParteNivelVehiculo:herramienta.idParteNivelVehiculo
      }))
    )

    // Aquí puedes usar directamente papelesEncuestaVehiculo sin inicializarlo nuevamente
    const papelesEncuestaGuardados = await PapelesEncuestaVehiculo.bulkCreate(
      papelesEncuestaVehiculo.map((papeles) => ({
        idEncuesta: nuevaEntrada.id,
        idPapelVehiculo: papeles.idPapelVehiculo,
        poseeDocumento: papeles.poseeDocumento,
      }))
    );

    // Enviar una respuesta con el ID de la entrada creada y las encuestas del vehículo guardadas
    res.json({
      success: true,
      entradaId: nuevaEntrada.id,
      partesEncuestaGuardadas,
      papelesEncuestaGuardados, 
      herramientasEncuestaGuardadas,
      nivelesEncuestaGuardadas,
  
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
  }
};




// Actualizar un colaborador
exports.updateEntrada = (req, res) => {
  const entradaId = req.params.documento_colaborador
  const {salida,cliente} = req.body;

  Entrada.update({ salida,cliente }, { where: { documento_colaborador: entradaId ,}  })
    .then(result => {
      if (result[0] === 0) {
        return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.json({ success: true});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
    });
};

// // Actualizar un colaborador
// exports.updateColaborador = (req, res) => {
//   const colaboradorId = req.params.id;
//   const { correo, pw, nombres, apellidos } = req.body;

//   Colaborador.update({ correo, pw, nombres, apellidos }, { where: { id: colaboradorId } })
//     .then(result => {
//       if (result[0] === 0) {
//         return res.status(404).json({ error: 'Colaborador no encontrado' });
//       }
//       res.json({ message: 'Colaborador actualizado correctamente' });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
//     });
// };

// // Eliminar un colaborador
// exports.deleteColaborador = (req, res) => {
//   const colaboradorId = req.params.id;

//   Colaborador.destroy({ where: { id: colaboradorId } })
//     .then(result => {
//       if (result === 0) {
//         return res.status(404).json({ error: 'Colaborador no encontrado' });
//       }
//       res.json({ message: 'Colaborador eliminado correctamente' });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Ocurrió un error al eliminar el colaborador' });
//     });
// };
