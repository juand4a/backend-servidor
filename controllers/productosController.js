const Productos=require('../models/productos')
const Puntos=require('./../models/Puntos')
const EstadoSolicitud = require('../models/EstadoSolicitud');


const Solicitud=require('./../models/solicitudpedidos')

exports.getAllProducts = (req, res) => {
    Productos.findAll()
    
      .then(Productos => {
        res.json(Productos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };

  exports.createProducst = async (req, res) => {
    const {
      nombre,
      descripcion,
      precio,
      fecha_creacion,
      imagen_url

    } = req.body;
  
    try {
      // Crear la entrada
      const PuntosGuardados = await Productos.create({
        nombre,
        descripcion,
        precio,
        fecha_creacion,
        imagen_url
      });
      
      // Enviar una respuesta con el ID de la entrada creada y las encuestas del vehículo guardadas
      res.json({
        success: true,
        entradaId: PuntosGuardados.id
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
    }
  };

  exports.getPuntosSumadosByDocumento = async (req, res) => {
    const documento = req.params.documento;
    try {
      const puntosSumados = await Puntos.sum('puntos', {
        where: {
          documento_colaborador: documento
        }
      });
      res.json({ puntosSumados });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los puntos sumados por documento' });
    }
  };

  exports.getAllRequestClient = (req, res) => {
    Solicitud.findAll({
      include: [
        {
          model:EstadoSolicitud ,
          attributes: ['estadoSolicitud'],
          as: 'estado_asociation'
        }
      ]
    })
    
      .then(Solicitud => {
        res.json(Solicitud);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };

  exports.createRequest = async (req, res) => {
    const {
      id_producto,
      documento_colaborador,
      estadoSolicitud,
      descripcion,
      precio

    } = req.body;
  
    try {
      // Crear la entrada
      const RequestGuardados = await Solicitud.create({
        id_producto,
        documento_colaborador,
        estadoSolicitud,
        descripcion,
        precio
      });
      
      res.json({
        success: true,
        id: RequestGuardados.id
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Ocurrió un error al guardar los datos en la base de datos' });
    }
  };
  exports.updateR = async (req, res) => {
    const entradaId = req.params.documento_colaborador;
    const { estadoSolicitud } = req.body;
  
    try {
      // Obtener la solicitud por documento_colaborador
      const solicitud = await Solicitud.findOne({
        where: { documento_colaborador: entradaId },
        include: [
          {
            model: Productos,
            attributes: ['precio'],
            as: 'producto_asociation'
          },
        ]
      });
  
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada para el colaborador.' });
      }
  
      // Actualizar el estado de la solicitud
      await Solicitud.update({ estadoSolicitud }, { where: { documento_colaborador: entradaId } });
  
      // Consultar los puntos acumulados por el documento_colaborador
      const puntosAcumulados = await Puntos.findOne({
        attributes: ['puntos'],
        where: { documento_colaborador: entradaId }
      });
  
      if (estadoSolicitud == 3 && puntosAcumulados.puntos === solicitud.producto_asociation.precio) {
        // Restar los puntos restando el valor del precio
        const puntosRestantes = puntosAcumulados.puntos - solicitud.producto_asociation.precio;
        await Puntos.update({ puntos: puntosRestantes }, { where: { documento_colaborador: entradaId } });
      }
  
      res.json({
        success: true,
        message: 'Estado actualizado exitosamente.'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al actualizar el estado en la base de datos.' });
    }
  };
  
  
  
  
  
  
 
  
  
  
  


  