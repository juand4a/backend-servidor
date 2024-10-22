// controllers/colaboradorController.js

const colaboradorService = require('../service/colaboradorService');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const isProduction = process.env.NODE_ENV === 'production'; // Verifica si es producción
const nodemailer = require('nodemailer');

// Configuración de AWS S3
let s3Client;
if (isProduction) {
  s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.ACCESS_SECRET
    }
  });
}

// Función para subir archivo a S3 en producción
const uploadToS3 = async (filePath, fileName, documentFolder) => {
  if (!isProduction) return null; // No sube a S3 si no es producción

  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${documentFolder}/${fileName}`, // Guardar en la carpeta específica
    Body: fileContent,
    ContentType: 'image/jpeg', // Ajusta según el tipo de imagen
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    const location = `https://${params.Bucket}.s3.${process.env.REGION}.amazonaws.com/${params.Key}`;
    return { Location: location };
  } catch (error) {
    console.error('Error al subir a S3:', error);
    throw error;
  }
};

// Función para asegurar que el directorio existe localmente
function ensureDirSync(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.error('Error al crear el directorio', err);
    throw err; // Re-lanzar el error para manejarlo en el controlador
  }
}

// Guardar archivo localmente en modo desarrollo
const saveLocalFile = (filePath, buffer) => {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

// Controlador para crear un colaborador
exports.createColaborador = [
  async (req, res) => {
    const { documento, foto_base64 } = req.body;

    if (!foto_base64) {
      return res.status(400).json({ error: 'No se proporcionó una imagen de entrada' });
    }

    // Decodificar imagen base64 y guardar temporalmente en /tmp o localmente
    const buffer = Buffer.from(foto_base64, 'base64');
    let tempFilePath;

    if (isProduction) {
      // Si está en producción, usa la carpeta temporal de /tmp
      const tempDirPath = path.join('/tmp', 'temp', documento);
      ensureDirSync(tempDirPath);
      tempFilePath = path.join(tempDirPath, `temp_image_entrada.jpeg`);
      fs.writeFileSync(tempFilePath, buffer);
    } else {
      // Si está en desarrollo, guarda en htdocs/files-redm
      const localDirPath = path.join('C:/xampp/htdocs/files-redm', documento);
      tempFilePath = path.join(localDirPath, `foto_perfil_${documento}_${Date.now()}.jpeg`);
      saveLocalFile(tempFilePath, buffer);
    }

    // Si estamos en producción, subimos a S3, de lo contrario mantenemos la ruta local
    let imageUrl;
    if (isProduction) {
      const documentFolder = `foto_perfil/${documento}`;
      const sanitizedFilename = `foto_perfil_${documento}_${Date.now()}.jpeg`;
      const s3Response = await uploadToS3(tempFilePath, sanitizedFilename, documentFolder);
      imageUrl = s3Response.Location;
      fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal después de subir
    } else {
      imageUrl = tempFilePath; // Guardamos la ruta local
    }

    // El resto del código es para crear el colaborador y enviar un correo de bienvenida
    const {
      nombres,
      apellidos,
      genero,
      celular,
      fechaNacimiento,
      fechaIngreso,
      cargo,
      salario,
      ciudadNacimiento,
      ciudadResidencia,
      direccionResidencia,
      tipoContrato,
      correo,
      pw,
      estadoEmpleado,
      estadoCuenta,
      qrCodeUrl,
      eps,
      afp,
      grupoSanguineo,
      estrato,
      estadoCivil,
      telefonoFijo,
      estatura,
      peso,
      celularCorporativo,
      portafolioId,
      serial_zebra,
      serial_tablet,
      placa,
      codigoVendedor,
    } = req.body;

    if (!pw) {
      return res.status(400).json({ error: 'La contraseña es requerida' });
    }

    try {
      // Configura nodemailer para enviar el correo de bienvenida
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Bienvenido a la empresa',
        html: `
          <p>Estimado/a ${nombres} ${apellidos},</p>
          <p>Le damos la bienvenida a la empresa. A continuación, encontrará sus credenciales de acceso:</p>
          <ul>
            <li><strong>Correo:</strong> ${correo}</li>
            <li><strong>Contraseña:</strong> ${pw}</li>
          </ul>
          <p>Este mensaje fue generado automáticamente por el aplicativo de Red de Marcas, por favor no responder.</p>
        `
      };

      // Enviar el correo de bienvenida antes de crear el colaborador
      await transporter.sendMail(mailOptions);

      // Crear el colaborador en la base de datos
      const colaborador = await colaboradorService.createColaborador({
        documento,
        nombres,
        apellidos,
        genero,
        celular,
        fechaNacimiento,
        fechaIngreso,
        cargo,
        salario,
        ciudadNacimiento,
        ciudadResidencia,
        direccionResidencia,
        tipoContrato,
        correo,
        pw,
        estadoEmpleado,
        estadoCuenta,
        qrCodeUrl,
        fotoUrl: imageUrl, // URL de la foto cargada (S3 o local)
        jefeInmediato: null,
        eps,
        afp,
        grupoSanguineo,
        estrato,
        estadoCivil,
        telefonoFijo,
        estatura,
        peso,
        celularCorporativo,
        portafolioId,
        serial_zebra,
        serial_tablet,
        placa,
        codigoVendedor,
      });

      res.json({
        status: 'success',
        code: 200,
        message: 'Colaborador creado correctamente',
        data: colaborador,
      });
    } catch (error) {
      console.error('Error al crear el colaborador o enviar el correo:', error);
      res.status(500).json({ error: 'Ocurrió un error al crear el colaborador o enviar el correo' });
    }
  },
];

// Controlador para actualizar un colaborador
exports.updateColaborador = async (req, res) => {
  const documentop = req.params.documento_colaborador;
  const colaboradorData = req.body;

  try {
    // Obtén el colaborador actual para verificar si existe
    const colaborador = await colaboradorService.getColaboradorByDocumento(documentop);

    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }

    // Si se proporciona una imagen, decodificarla y subirla a S3 o guardarla localmente
    if (colaboradorData.fotoUrl) {
      const buffer = Buffer.from(colaboradorData.fotoUrl, 'base64');
      let tempFilePath;

      if (isProduction) {
        // Subir a S3 en producción
        const tempDirPath = path.join('/tmp', 'temp', documentop);
        ensureDirSync(tempDirPath);
        tempFilePath = path.join(tempDirPath, `temp_image_entrada.jpeg`);
        fs.writeFileSync(tempFilePath, buffer);
      } else {
        // Guardar en htdocs/files-redm en desarrollo
        const localDirPath = path.join('C:/xampp/htdocs/files-redm', documentop);
        tempFilePath = path.join(localDirPath, `foto_perfil_${documentop}_${Date.now()}.jpeg`);
        saveLocalFile(tempFilePath, buffer);
      }

      // Si estamos en producción, subimos a S3, de lo contrario mantenemos la ruta local
      let imageUrl;
      if (isProduction) {
        const documentFolder = `foto_perfil/${documentop}`;
        const sanitizedFilename = `foto_perfil_${documentop}_${Date.now()}.jpeg`;
        const s3Response = await uploadToS3(tempFilePath, sanitizedFilename, documentFolder);
        imageUrl = s3Response.Location;
        fs.unlinkSync(tempFilePath); // Eliminar archivo temporal
      } else {
        imageUrl = tempFilePath; // Guardar la ruta local
      }

      colaboradorData.fotoUrl = imageUrl;
    }

    // Actualizar los datos del colaborador
    const updatedRows = await colaboradorService.updateColaborador(documentop, colaboradorData);

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar colaborador:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el colaborador' });
  }
};
exports.updateColaboradorStatus = async (req, res) => {
  const documentop = parseInt(req.params.documento_colaborador, 10);  // Convierte a número
  const { estadoCuenta } = req.body;

  try {
    // Intenta actualizar directamente el campo estadoCuenta y guarda el número de filas afectadas
    const updatedRows = await colaboradorService.updateColaborador(documentop, { estadoCuenta });

    if (updatedRows === 0) {
      // Si no se actualizó ninguna fila, el colaborador no existe
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }

    res.json({ success: true, message: 'Estado de cuenta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado de cuenta:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el estado de cuenta' });
  }
};


exports.getColaboradoresByCodigoVendedor = async (req, res) => {
  try {
    const colaboradores = await colaboradorService.getColaboradoresByCodigoVendedor();

    if (!colaboradores.length) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No hay colaboradores con código de vendedor diferente de 0.',
        data: [],
      });
    }

    res.json({
      status: 'success',
      code: 200,
      message: 'Colaboradores con código de vendedor diferente de 0 obtenidos correctamente',
      data: colaboradores,
    });
  } catch (error) {
    console.error('Error al obtener colaboradores con código de vendedor diferente de 0:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores con código de vendedor diferente de 0' });
  }
};

// Endpoint para obtener colaboradores con cargo 17
exports.getColaboradoresByCargo17 = async (req, res) => {
  try {
    const colaboradores = await colaboradorService.getColaboradoresByCargo17();

    if (!colaboradores.length) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No hay colaboradores con cargo 17.',
        data: [],
      });
    }

    res.json({
      status: 'success',
      code: 200,
      message: 'Colaboradores con cargo 17 obtenidos correctamente',
      data: colaboradores,
    });
  } catch (error) {
    console.error('Error al obtener colaboradores con cargo 17:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores con cargo 17' });
  }
};

exports.getAllColaboradores = async (req, res) => {
  try {
    // Obtener el cargo del usuario desde los parámetros de la petición
    const { cargo: userCargo } = req.params; // Ajustar según tu implementación para capturar el cargo
    const cargoNumber = parseInt(userCargo, 10);

    // Validar si el cargo existe antes de continuar
    if (!cargoNumber) {
      return res.status(400).json({ error: 'El cargo del usuario no ha sido proporcionado o es inválido.' });
    }

    // Obtener los colaboradores basados en el cargo del usuario
    const colaboradores = await colaboradorService.getAllColaboradores(cargoNumber);

    // Verificar si hay colaboradores que mostrar
    if (!colaboradores.length) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'No hay colaboradores con los que tengas acceso.',
        data: [],
      });
    }

    // Responder con los colaboradores obtenidos
    res.json({
      status: 'success',
      code: 200,
      message: 'Colaboradores obtenidos correctamente',
      data: colaboradores,
    });
  } catch (error) {
    console.error('Error al obtener colaboradores:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores' });
  }
};
exports.getColaboradorById = async (req, res) => {
  const colaboradorId = req.params.id;
  try {
    const colaborador = await colaboradorService.getColaboradorById(colaboradorId);
    if (!colaborador) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'Colaborador encontrado correctamente',
      data: colaborador,
    });
  } catch (error) {
    console.error('Error al obtener colaborador:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el colaborador' });
  }
};



exports.deleteColaborador = async (req, res) => {
  const colaboradorId = req.params.id;
  try {
    const deletedRows = await colaboradorService.deleteColaborador(colaboradorId);
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Colaborador no encontrado' });
    }
    res.json({ message: 'Colaborador eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar colaborador:', error);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el colaborador' });
  }
};

exports.getAllColaboradoresByGenero = async (req, res) => {
  const cargo = req.params.cargo;

  try {
    const totals = await colaboradorService.getAllColaboradoresByGenero(cargo);
    res.json({
      status: 'success',
      code: 200,
      message: 'Colaboradores obtenidos por género',
      data: totals,
    });
  } catch (error) {
    console.error('Error al obtener colaboradores por género:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores por género' });
  }
};

exports.getAllColaboradoresTotal = async (req, res) => {
  const cargo = req.params.cargo;

  try {
    const total = await colaboradorService.getAllColaboradoresTotal(cargo);
    res.json({ total });
  } catch (error) {
    console.error('Error al obtener total de colaboradores:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el total de colaboradores' });
  }
};

exports.getAllColaboradoresByCargo = async (req, res) => {
  try {
    const totals = await colaboradorService.getAllColaboradoresByCargo();
    res.json(totals);
  } catch (error) {
    console.error('Error al obtener colaboradores por cargo:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores por cargo' });
  }
};

exports.getAllColaboradoresByAprendiz = async (req, res) => {
  try {
    const totals = await colaboradorService.getAllColaboradoresByAprendiz();
    res.json(totals);
  } catch (error) {
    console.error('Error al obtener colaboradores por aprendiz:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los colaboradores por aprendiz' });
  }
};
