const negociosService = require('../service/negociosService');
const { S3Client } = require('@aws-sdk/client-s3');
const { saveImageLocally, uploadToS3 } = require('../utils/fileUtils');

// Verifica si estamos en un entorno de producción
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de AWS S3 si estamos en producción
let s3Client;
if (isProduction) {
  s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_SECRET,
    },
  });
}

// Función auxiliar para procesar la imagen (subir a S3 o guardar localmente)
async function handleImageUpload(base64Image, folder, fileName) {
  if (!isProduction) {
    console.log('Desarrollo: Guardando imagen localmente...');
    // Guardamos la imagen localmente en el directorio de XAMPP
    return saveImageLocally(base64Image, folder, fileName);
  }

  // Subir a S3 en producción
  console.log('Producción: Subiendo imagen a S3...');
  try {
    const documentFolder = folder; // Carpeta donde almacenar en S3
    const fileUrl = await uploadToS3(base64Image, fileName, documentFolder, s3Client);
    console.log('Imagen subida a S3 en:', fileUrl);
    return fileUrl; // URL de la imagen subida a S3
  } catch (error) {
    console.error('Error al subir la imagen a S3:', error);
    throw error;
  }
}

// Crear un nuevo negocio
exports.createNegocio = async (req, res) => {
  const { nombre_negocio, nit_negocio, direccion, estrato_negocio, segmento, celular_cliente, latitud, longitud, foto_antes, foto_despues } = req.body;
  
  try {
    // Subir las imágenes si están presentes
    let fotoAntesUrl = null;
    let fotoDespuesUrl = null;
    
    if (foto_antes) {
      console.log('Subiendo imagen "foto_antes"...');
      fotoAntesUrl = await handleImageUpload(foto_antes, 'antes', `${nit_negocio}_antes.jpg`);
      console.log('URL de "foto_antes":', fotoAntesUrl);
    }
    
    if (foto_despues) {
      console.log('Subiendo imagen "foto_despues"...');
      fotoDespuesUrl = await handleImageUpload(foto_despues, 'despues', `${nit_negocio}_despues.jpg`);
      console.log('URL de "foto_despues":', fotoDespuesUrl);
    }

    // Crear el nuevo negocio
    const nuevoNegocio = await negociosService.createNegocio({
      nombre_negocio,
      nit_negocio,
      direccion,
      estrato_negocio,
      segmento,
      celular_cliente,
      latitud,
      longitud,
      foto_antes: fotoAntesUrl,
      foto_despues: fotoDespuesUrl,
    });

    console.log('Nuevo negocio creado con éxito:', nuevoNegocio);

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Negocio creado correctamente',
      data: nuevoNegocio,
    });
  } catch (err) {
    console.error('Error al crear el negocio:', err);
    res.status(500).json({ error: 'Ocurrió un error al crear el negocio' });
  }
};
// Obtener todos los negocios
exports.getAllNegocios = async (req, res) => {
  try {
    const negocios = await negociosService.getAllNegocios();
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Negocios obtenidos correctamente',
      data: negocios,
    });
  } catch (err) {
    console.error('Error al obtener los negocios:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener los negocios' });
  }
};

// Obtener un negocio por su ID
exports.getNegocioById = async (req, res) => {
  try {
    const negocio = await negociosService.getNegocioById(req.params.id);
    if (!negocio) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Negocio obtenido correctamente',
      data: negocio,
    });
  } catch (err) {
    console.error('Error al obtener el negocio:', err);
    res.status(500).json({ error: 'Ocurrió un error al obtener el negocio' });
  }
};

// Actualizar un negocio por su ID
exports.updateNegocio = async (req, res) => {
  const { foto_antes, foto_despues } = req.body;
  
  try {
    const negocio = await negociosService.getNegocioById(req.params.id);
    if (!negocio) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }

    // Subir las imágenes si se actualizan
    let fotoAntesUrl = negocio.foto_antes;
    let fotoDespuesUrl = negocio.foto_despues;

    if (foto_antes) {
      console.log('Actualizando imagen "foto_antes"...');
      fotoAntesUrl = await handleImageUpload(foto_antes, 'antes', `${negocio.nit_negocio}_antes.jpg`);
      console.log('URL de la nueva "foto_antes":', fotoAntesUrl);
    }

    if (foto_despues) {
      console.log('Actualizando imagen "foto_despues"...');
      fotoDespuesUrl = await handleImageUpload(foto_despues, 'despues', `${negocio.nit_negocio}_despues.jpg`);
      console.log('URL de la nueva "foto_despues":', fotoDespuesUrl);
    }

    // Actualizar los datos del negocio
    await negocio.update({
      ...req.body,
      foto_antes: fotoAntesUrl,
      foto_despues: fotoDespuesUrl,
    });

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Negocio actualizado correctamente',
      data: negocio,
    });
  } catch (err) {
    console.error('Error al actualizar el negocio:', err);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el negocio' });
  }
};

// Eliminar un negocio por su ID
exports.deleteNegocio = async (req, res) => {
  try {
    const success = await negociosService.deleteNegocio(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Negocio no encontrado' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error('Error al eliminar el negocio:', err);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el negocio' });
  }
};
