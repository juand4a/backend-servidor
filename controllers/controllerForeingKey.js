const Genero =require('./../models/Genero')

exports.getAllGenero = (req, res) => {
    Genero.findAll()
    
      .then(genero => {
        res.json(genero);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
  };