// controllers/colaboradorController.js

const colaboradorService = require('../service/colaboradorService');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.createColaborador = async (req, res) => {
  const {
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
    fotoUrl,
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
  } = req.body;

  if (!pw) {
    return res.status(400).json({ error: 'La contraseña es requerida' });
  }

  try {
    const hashedPassword = await bcrypt.hash(pw, 10);

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
      pw: hashedPassword,
      estadoEmpleado,
      estadoCuenta,
      qrCodeUrl,
      fotoUrl,
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
    });

    // Envía un correo de bienvenida (descomentar y configurar con variables de entorno)
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: colaborador.correo,
    //   subject: 'Bienvenido a la empresa',
    //   text: `Usuario creado. Su documento de identidad es la contraseña de acceso.`,
    // };

    // await transporter.sendMail(mailOptions);

    res.json({
      status: 'success',
      code: 200,
      message: 'Colaborador creado correctamente',
      data: colaborador,
    });
  } catch (error) {
    console.error('Error al crear el colaborador:', error);
    res.status(500).json({ error: 'Ocurrió un error al crear el colaborador' });
  }
};

exports.getAllColaboradores = async (req, res) => {
  try {
    const colaboradores = await colaboradorService.getAllColaboradores();
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

exports.updateColaborador = async (req, res) => {
  const documentop = req.params.documento_colaborador;
  const colaboradorData = req.body;

  try {
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
