const Ciudad=require('../models/Ciudad')

exports.getAllCiudad = (req, res) => {
  Ciudad.findAll()
    
      .then(ciudad => {
        res.json(ciudad);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al obtener las entradas' });
      });
      
  };