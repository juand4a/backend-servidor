// services/anunciosService.js

const Anuncios = require('../models/anuncios');
const Colaborador = require('../models/colaborador');
const Likes = require('../models/likes');
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

const createAnuncio = async (anuncioData) => {
  try {
    const anuncio = await Anuncios.create(anuncioData);
    return anuncio;
  } catch (error) {
    throw new Error('Error al crear el anuncio');
  }
};

const getAllAnunciosCumpleaños = async () => {
  const fechaActual = new Date();
  const mesDiaActual = fechaActual.toISOString().slice(5, 10); // Obtiene el formato 'mm-dd'

  const colaboradoresCumpleaños = await Colaborador.findAll({
    where: literal(`DATE_FORMAT(fechaNacimiento, '%m-%d') = '${mesDiaActual}'`),
    attributes: ['id', 'nombres', 'apellidos', 'fechaNacimiento', 'fotoUrl', 'documento'],
  });

  const anunciosCumpleaños = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Cumpleaños',
      [Op.and]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
      ],
    },
  });

  const colaboradoresSinAnuncio = colaboradoresCumpleaños.filter((colaborador) => {
    const documentoColaborador = colaborador.documento;
    return !anunciosCumpleaños.some((anuncio) => anuncio.documento_colaborador === documentoColaborador);
  });

  for (const colaborador of colaboradoresSinAnuncio) {
    await Anuncios.create({
      titulo: `¡Feliz Cumpleaños, ${colaborador.nombres}! 🎉`,
      contenido: `Hoy celebramos el cumpleaños de ${colaborador.nombres} ${colaborador.apellidos}. ¡Deseémosle un día lleno de alegría y éxitos!`,
      fechaPublicacion: fechaActual,
      foto: colaborador.fotoUrl,
      tipoAnuncio: 'Cumpleaños',
      documento_colaborador: colaborador.documento,
    });
  }

  const nuevosAnunciosCumpleaños = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Cumpleaños',
      [Op.and]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
      ],
    },
    include: [
      {
        model: Likes,
        as: 'likes_asociation',
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('likes_asociation.id')), 'totalLikes']
        ]
      }
    ],
    group: ['anuncios.id'],
  });

  return nuevosAnunciosCumpleaños;
};

const getAllAnuncios = async () => {
  const anuncios = await Anuncios.findAll({
    where: {
      tipoAnuncio: {
        [Op.ne]: 'Cumpleaños'
      }
    },
    include: [
      {
        model: Likes,
        as: 'likes_asociation',
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('likes_asociation.id')), 'totalLikes']
        ]
      }
    ],
    group: ['anuncios.id'],
  });

  return anuncios;
};

module.exports = {
  createAnuncio,
  getAllAnunciosCumpleaños,
  getAllAnuncios,
};
