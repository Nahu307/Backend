
const UserModel = require('../dao/models/userModel');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(user) {
    try {
      // Validar datos de entrada
      if (!user.username || !user.email || !user.password) {
        throw new Error('Nombre de usuario, email y contraseña son obligatorios');
      }

      // Encriptar la contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;

      // Crear el usuario en la base de datos
      return await UserModel.create(user);
    } catch (error) {
      console.error('Error al crear el usuario:', error.message);
      throw error;
    }
  }
}

module.exports = UserService;
