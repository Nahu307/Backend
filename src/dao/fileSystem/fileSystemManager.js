const fs = require('fs').promises;
const path = require('path');

class FileSystemManager {
  constructor() {}

  async readFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    } catch (err) {
      console.error(`Error al leer el archivo ${filePath}: ${err}`);
      throw err;
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (err) {
      console.error(`Error al escribir en el archivo ${filePath}: ${err}`);
      throw err;
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Error al eliminar el archivo ${filePath}: ${err}`);
      throw err;
    }
  }
}

module.exports = FileSystemManager;
