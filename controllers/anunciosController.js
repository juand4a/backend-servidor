// controllers/anunciosController.js

const anunciosService = require('./../service/anunciosService');

exports.createAnuncio = async (req, res) => {
  const {
    titulo,
    contenido,
    fechaPublicacion,
    foto,
    tipoAnuncio
  } = req.body;

  try {
    const anuncio = await anunciosService.createAnuncio({
      titulo,
      contenido,
      fechaPublicacion,
      foto,
      tipoAnuncio,
    });

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncio Creado Correctamente',
      data: anuncio
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al crear el anuncio' });
  }
};

exports.getAllAnunciosCumpleaños = async (req, res) => {
  try {
    const anunciosCumpleaños = await anunciosService.getAllAnunciosCumpleaños();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncios de Cumpleaños Obtenidos Correctamente',
      data: anunciosCumpleaños
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios de cumpleaños' });
  }
};

exports.getAllAnuncios = async (req, res) => {
  try {
    const anuncios = await anunciosService.getAllAnuncios();

    res.json({
      status: 'success',
      code: 200,
      message: 'Anuncio Obtenidos Correctamente',
      data: anuncios
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios' });
  }
};
