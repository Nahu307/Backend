
const MessageModel = require('../dao/models/messageModel');

class MessageService {
  async saveMessage(user, message) {
    try {
      const newMessage = new MessageModel({ user, message });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
      throw error;
    }
  }

  async getAllMessages() {
    try {
      const messages = await MessageModel.find();
      return messages;
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      throw error;
    }
  }
}

module.exports = MessageService;
