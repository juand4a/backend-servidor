// services/anunciosService.js

const Anuncios = require('../models/anuncios');
const Colaborador = require('../models/colaborador');
const Likes = require('../models/likes');
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

const createAnuncio = async (colaborador, tipoAnuncio, fechaPublicacion, contenido, titulo) => {
  await Anuncios.create({
    titulo,
    contenido,
    fechaPublicacion,
    foto: colaborador.fotoUrl,
    tipoAnuncio,
    documento_colaborador: colaborador.documento,
  });
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

const getAllAnunciosCumpleaños = async () => {
  const fechaActual = new Date();
  const mesDiaActual = fechaActual.toISOString().slice(5, 10); // Obtiene el formato 'mm-dd'

  const anunciosCumpleaños = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Cumpleaños',
      [Op.and]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
      ],
    },
  });

  if (anunciosCumpleaños.length === 0) {
    const colaboradoresCumpleaños = await Colaborador.findAll({
      where: literal(`DATE_FORMAT(fechaNacimiento, '%m-%d') = '${mesDiaActual}'`),
      attributes: ['id', 'nombres', 'apellidos', 'fechaNacimiento', 'fotoUrl', 'documento'],
    });

    for (const colaborador of colaboradoresCumpleaños) {
      await createAnuncio(
        colaborador,
        'Cumpleaños',
        fechaActual,
        `Hoy celebramos el cumpleaños de ${colaborador.nombres} ${colaborador.apellidos}. ¡Deseémosle un día lleno de alegría y éxitos!`,
        `¡Feliz Cumpleaños, ${colaborador.nombres}! 🎉`
      );
    }
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

const getAllAnunciosNuevosIngresos = async () => {
  const fechaActual = new Date();
  const mesActual = fechaActual.toISOString().slice(5, 7); // Obtiene el mes actual en formato 'mm'

  const anunciosNuevosIngresos = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Nuevo Ingreso',
      [Op.and]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m') = '${mesActual}'`), // Muestra los anuncios durante el mes actual
      ],
    },
  });

  if (anunciosNuevosIngresos.length === 0) {
    const colaboradoresNuevosIngresos = await Colaborador.findAll({
      where: literal(`DATE_FORMAT(fechaIngreso, '%m') = '${mesActual}'`),
      attributes: ['id', 'nombres', 'apellidos', 'fechaIngreso', 'fotoUrl', 'documento'],
    });

    for (const colaborador of colaboradoresNuevosIngresos) {
      await createAnuncio(
        colaborador,
        'Nuevo Ingreso',
        fechaActual,
        `${colaborador.nombres} ${colaborador.apellidos} se unió a nuestro equipo en ${colaborador.fechaIngreso}. ¡Démosle una cálida bienvenida!`,
        `¡Bienvenido(a) ${colaborador.nombres}! 🎉`
      );
    }
  }

  const nuevosAnunciosNuevosIngresos = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Nuevo Ingreso',
      [Op.and]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m') = '${mesActual}'`), // Muestra los anuncios durante el mes actual
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

  return nuevosAnunciosNuevosIngresos;
};

const getAllAnunciosAniversariosIngreso = async () => {
  const fechaActual = new Date();
  const mesDiaActual = fechaActual.toISOString().slice(5, 10); // Obtiene el formato 'mm-dd'

  const anunciosAniversariosIngreso = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Aniversario de Ingreso',
      [Op.and ]: [
        literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
      ],
    },
  });

  if (anunciosAniversariosIngreso.length === 0) {
    const colaboradoresAniversario = await Colaborador.findAll({
      where: literal(`DATE_FORMAT(fechaIngreso, '%m-%d') = '${mesDiaActual}'`),
      attributes: ['id', 'nombres', 'apellidos', 'fechaIngreso', 'fotoUrl', 'documento'],
    });

    for (const colaborador of colaboradoresAniversario) {
      const fechaIngreso = new Date(colaborador.fechaIngreso);
      const añosIngreso = fechaActual.getFullYear() - fechaIngreso.getFullYear();
      const tituloAnuncio = añosIngreso > 0 
        ? `🎉 ¡Feliz ${añosIngreso}° Aniversario, ${colaborador.nombres}! 🎉`
        : `🎉 ¡Feliz Primer , ${colaborador.nombres}! 🎉`;

      await createAnuncio(
        colaborador,
        'Aniversario de Ingreso',
        fechaActual,
        `Este mes celebramos el ${añosIngreso}° aniversario de ingreso de ${colaborador.nombres} ${colaborador.apellidos}. ¡Gracias por ser parte de nuestro equipo durante estos años!`,
        tituloAnuncio
      );
    }
  }

  const nuevosAnunciosAniversariosIngreso = await Anuncios.findAll({
    where: {
      tipoAnuncio: 'Aniversario de Ingreso',
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

  return nuevosAnunciosAniversariosIngreso;
};

module.exports = {
  createAnuncio,
  getAllAnunciosCumpleaños,
  getAllAnuncios,
  getAllAnunciosNuevosIngresos,
  getAllAnunciosAniversariosIngreso,
};
