// services/interaccionesService.js

const Likes = require('../models/likes');
const Comentarios = require('../models/comentarios');
const Colaborador = require('../models/colaborador');

const createLike = async (anuncioId, usuarioId) => {
  try {
    const like = await Likes.create({ anuncio_id: anuncioId, usuario_id: usuarioId });
    return like;
  } catch (error) {
    throw new Error('Error al crear el like');
  }
};

const createComentario = async (anuncioId, usuarioId, comentario) => {
  try {
    const fechaActual = new Date().toISOString().split('T')[0];
    const nuevoComentario = await Comentarios.create({
      anuncio_id: anuncioId,
      idUsuario: usuarioId,
      comentario,
      fecha: fechaActual,
    });
    return nuevoComentario;
  } catch (error) {
    throw new Error('Error al crear el comentario');
  }
};

const getComentariosPorAnuncio = async (anuncioId) => {
  try {
    const comentarios = await Comentarios.findAll({
      where: { anuncio_id: anuncioId },
      include: [
        {
          model: Colaborador,
          attributes: ['nombres', 'apellidos', 'fotoUrl'],
          as: 'colaborador_asociation',
        },
      ],
    });
    return comentarios;
  } catch (error) {
    throw new Error('Error al obtener los comentarios del anuncio');
  }
};

module.exports = {
  createLike,
  createComentario,
  getComentariosPorAnuncio,
};
