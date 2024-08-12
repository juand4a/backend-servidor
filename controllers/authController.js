// controllers/authController.js

const authService = require('../service/authService');

exports.login = async (req, res) => {
  try {
    const { correo, pw } = req.body;
    const { colaborador, token } = await authService.login(correo, pw);
    res.json({ success: true, colaborador, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(401).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    const { token } = req.body;
    authService.logout(token);
    res.json({ success: true, message: 'Se ha cerrado sesión correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    res.status(401).json({ error: error.message });
  }
};

exports.sendCodeByEmail = async (req, res) => {
  try {
    const { correo } = req.body;
    await authService.sendVerificationCode(correo);
    res.json({ success: true, message: 'Código enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el código por correo electrónico:', error.message);
    res.status(500).json({ error: 'Error al enviar el código por correo electrónico' });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { codigo } = req.body;
    await authService.verifyCode(codigo);
    res.json({ success: true, message: 'Código válido' });
  } catch (error) {
    console.error('Error al verificar el código:', error.message);
    res.status(404).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { documento, nuevaContrasena } = req.body;
    await authService.updatePassword(documento, nuevaContrasena);
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error.message);
    res.status(500).json({ error: error.message });
  }
};
