const Capacitacion=require('../models/capacitacion')


exports.crateCapacitacion = (req, res) => {
    const {
      descripcion,
      fecha,
      video
    } = req.body;
  
    Capacitacion.create({
        descripcion,
        fecha,
        video,
      })
        .then(capacitacion => {
          res.json(capacitacion);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Ocurrió un error al crear la capacitacion' });
        });
    }

    exports.getAllCapacitacion = (req, res) => {
        Capacitacion.findAll()
        
          .then(capacitacion => {
            res.json(capacitacion);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ocurrió un error al obtener las capacitaciones' });
          });
      };
