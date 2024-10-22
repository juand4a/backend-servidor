const Negocio = require('../models/Negocio');

// Crear un nuevo negocio
exports.createNegocio = async (negocioData) => {
  return await Negocio.create(negocioData);
};

// Obtener todos los negocios
exports.getAllNegocios = async () => {
  return await Negocio.findAll();
};

// Obtener un negocio por su ID
exports.getNegocioById = async (id) => {
  return await Negocio.findByPk(id);
};

// Actualizar un negocio por su ID
exports.updateNegocio = async (id, negocioData) => {
  const negocio = await Negocio.findByPk(id);
  if (negocio) {
    await negocio.update(negocioData);
    return negocio;
  }
  return null;
};

// Eliminar un negocio por su ID
exports.deleteNegocio = async (id) => {
  const negocio = await Negocio.findByPk(id);
  if (negocio) {
    await negocio.destroy();
    return true;
  }
  return false;
};
