// controllers/interaccionesController.js

const interaccionesService = require('../services/interaccionesService');

exports.createLikes = async (req, res) => {
  const anuncioId = req.params.anuncioId;
  const usuarioId = req.params.id;

  try {
    const like = await interaccionesService.createLike(anuncioId, usuarioId);
    res.json(like);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al crear el like' });
  }
};

exports.createComentarios = async (req, res) => {
  const anuncioId = req.params.anuncioId;
  const usuarioId = req.params.id;
  const { comentario } = req.body;

  try {
    const nuevoComentario = await interaccionesService.createComentario(anuncioId, usuarioId, comentario);
    res.json({ success: true, comentario: nuevoComentario });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Ocurrió un error al crear el comentario' });
  }
};

exports.getComentariosPorAnuncio = async (req, res) => {
  const anuncioId = req.params.anuncioId;

  try {
    const comentarios = await interaccionesService.getComentariosPorAnuncio(anuncioId);
    res.json(comentarios);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Ocurrió un error al obtener los comentarios del anuncio' });
  }
};
