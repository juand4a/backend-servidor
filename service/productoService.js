// services/productoService.js

const Productos = require('../models/productos');

const getAllProducts = async () => {
  return await Productos.findAll();
};

const createProduct = async (data) => {
  return await Productos.create(data);
};

const updateProduct = async (id, estado) => {
  const [updatedRows] = await Productos.update({ estado }, { where: { id } });
  return updatedRows;
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
};
