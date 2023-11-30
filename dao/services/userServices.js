
const UserModel = require('../dao/models/userModel');

class UserService {
  async createUser(user) {
    // Lógica para crear un usuario usando Mongoose
    return await UserModel.create(user);
  }

  async getUserById(userId) {
    // Lógica para obtener un usuario por ID usando Mongoose
    return await UserModel.findById(userId);
  }

  async updateUser(userId, updatedUserData) {
    // Lógica para actualizar un usuario usando Mongoose
    return await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
  }

  async deleteUser(userId) {
    // Lógica para eliminar un usuario usando Mongoose
    return await UserModel.findByIdAndRemove(userId);
  }
}

module.exports = UserService;