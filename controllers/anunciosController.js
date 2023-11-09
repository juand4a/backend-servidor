const Anuncios=require('../models/anuncios')
const Colaborador=require('../models/colaborador')
const Likes=require('../models/likes')
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

exports.createAnuncio = (req, res) => {
    const {
      titulo,
      contenido,
      fechaPublicacion,
      foto,
      tipoAnuncio
    } = req.body;
  
    Anuncios.create({
        titulo,
        contenido,
        fechaPublicacion,
        foto,
        tipoAnuncio,
      })
        .then(anuncio => {
          res.json(anuncio);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Ocurrió un error al crear el anuncio' });
        });
    }

      exports.getAllAnunciosCumpleaños = async (req, res) => {
        try {
          // Obtener el mes y día actual
          const fechaActual = new Date();
          const mesDiaActual = fechaActual.toISOString().slice(5, 10); // Obtiene el formato 'mm-dd'
      
          // Encontrar todos los colaboradores con el mismo mes y día de cumpleaños
          const colaboradoresCumpleaños = await Colaborador.findAll({
            where: literal(`DATE_FORMAT(fechaNacimiento, '%m-%d') = '${mesDiaActual}'`),
            attributes: ['id', 'nombres', 'apellidos', 'fechaNacimiento', 'fotoUrl', 'documento'],
          });
      
          // Crear un array para almacenar los anuncios de cumpleaños
          const anunciosCumpleaños = await Anuncios.findAll({
            where: {
              tipoAnuncio: 'Cumpleaños',
              [Op.and]: [
                literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
              ],
            },
          });
      
          // Filtrar los colaboradores para obtener solo los que no tienen un anuncio existente
          const colaboradoresSinAnuncio = colaboradoresCumpleaños.filter((colaborador) => {
            const documentoColaborador = colaborador.documento;
            return !anunciosCumpleaños.some((anuncio) => anuncio.documento_colaborador === documentoColaborador);
          });
      
          // Crear anuncios para los colaboradores que no tienen uno existente
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
      
          // Obtener los anuncios actualizados de cumpleaños (puede incluir los recién creados)
          const nuevosAnunciosCumpleaños = await Anuncios.findAll({
            where: {
              tipoAnuncio: 'Cumpleaños',
              [Op.and]: [
                literal(`DATE_FORMAT(fechaPublicacion, '%m-%d') = '${mesDiaActual}'`),
              ],
            },include: [
              {
                model: Likes, // Usar el modelo Likes
                as: 'likes_asociation', // Asegúrate de que coincida con el alias correcto
                attributes: [
                  [sequelize.fn('COUNT', sequelize.col('likes_asociation.id')), 'totalLikes']
                ]
              }
            ],
            group: ['anuncios.id'], 
          });
      
          // Responder con la lista de anuncios de cumpleaños
          res.json(nuevosAnunciosCumpleaños);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios de cumpleaños' });
        }
      };



      exports.getAllAnuncios = (req, res) => {
        Anuncios.findAll({
          where: {
            tipoAnuncio: {
              [Op.ne]: 'Cumpleaños'
            }
          },
          include: [
            {
              model: Likes, // Usar el modelo Likes
              as: 'likes_asociation', // Asegúrate de que coincida con el alias correcto
              attributes: [
                [sequelize.fn('COUNT', sequelize.col('likes_asociation.id')), 'totalLikes']
              ]
            }
          ],
          group: ['anuncios.id'], // Cambia 'Anuncios.id' a 'anuncios.id' para que coincida con el alias correcto
        })
          .then(anuncios => {
            res.json(anuncios);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Ocurrió un error al obtener los anuncios' });
          });
      };
      
      
      
      
      
      