const Likes=require('../models/likes')
const Comentarios=require('../models/comentarios')
const Colaborador=require('./../models/colaborador')
exports.createLikes = (req, res) => {
    const anuncioId = req.params.anuncioId;
    const usuarioId = req.params.id;
  
    Likes.create({
        anuncio_id:anuncioId,
        usuario_id:usuarioId,
      })
        .then(likes => {
          res.json(likes);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'error al traer los likes' });
        });
    }

    exports.createComentarios = (req, res) => {
      const anuncioId = req.params.anuncioId;
      const usuarioId = req.params.id;
    
      const { comentario } = req.body;
      
      // Obtener la fecha actual en el formato "yyyy-mm-dd"
      const fechaActual = new Date().toISOString().split('T')[0];
    
      Comentarios.create({
        anuncio_id: anuncioId,
        idUsuario: usuarioId,
        comentario,
        fecha: fechaActual // Asegúrate de que el campo se llame 'fecha' en tu modelo
      })
        .then(comentario => {
          res.json({ success: true, comentario });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Ocurrió un error al crear el comentario' });
        });
    }
    
    

    

exports.getComentariosPorAnuncio = (req, res) => {
  const anuncioId = req.params.anuncioId;

  Comentarios.findAll({
    where: {
      anuncio_id: anuncioId
    },
    include: [      {
      model: Colaborador,
      attributes: ['nombres','apellidos','fotoUrl'],
      as: 'colaborador_asociation'
    }] // Aquí se realiza el join con la tabla Colaborador
  })
    .then(comentarios => {
      res.json(comentarios);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Ocurrió un error al obtener los comentarios del anuncio' });
    });
}

