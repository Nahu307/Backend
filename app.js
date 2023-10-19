class ProductManager {
  constructor() {
      this.products = [];
  }

  generateUniqueId() {
      // Genera un ID único basado en la marca de tiempo (timestamp)
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  getProducts() {
      return this.products;
  }

  addProduct(productData) {
      // Verifica si el código ya existe en algún producto
      if (this.products.some((product) => product.code === productData.code)) {
          throw new Error('El código de producto ya está en uso.');
      }

      // Genera un ID único para el producto
      productData.id = this.generateUniqueId();

      // Agrega el producto al arreglo de productos
      this.products.push(productData);
  }

  getProductById(id) {
      const product = this.products.find((product) => product.id === id);

      if (!product) {
          throw new Error('Producto no encontrado.');
      }

      return product;
  }

  updateProduct(id, updatedFields) {
      const productIndex = this.products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
          throw new Error('Producto no encontrado.');
      }

      // Actualiza los campos del producto sin cambiar el ID
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
  }

  deleteProduct(id) {
      const productIndex = this.products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
          throw new Error('Producto no encontrado.');
      }

      // Elimina el producto del arreglo
      this.products.splice(productIndex, 1);
  }
}

// Crear una instancia de ProductManager
const manager = new ProductManager();

// Llamar a getProducts, debe devolver un arreglo vacío
console.log('Productos iniciales:', manager.getProducts());

// Agregar un producto
const nuevoProducto = {
  title: 'Iphone 11',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25,
};

try {
  manager.addProduct(nuevoProducto);
  console.log('Producto agregado con éxito.');
} catch (error) {
  console.error('Error al agregar producto:', error.message);
}

// Llamar a getProducts nuevamente, ahora debe mostrar el producto recién agregado
console.log('Productos después de agregar:', manager.getProducts());

// Obtener un producto por ID
try {
  const productoEncontrado = manager.getProductById(nuevoProducto.id);
  console.log('Producto encontrado por ID:', productoEncontrado);
} catch (error) {
  console.error('Error al buscar producto por ID:', error.message);
}

// Actualizar un producto
try {
  const updatedFields = {
      title: 'Producto actualizado',
      description: 'Este es un producto actualizado',
      price: 250,
  };
  manager.updateProduct(nuevoProducto.id, updatedFields);
  console.log('Producto actualizado con éxito.');
} catch (error) {
  console.error('Error al actualizar producto:', error.message);
}

// Eliminar un producto
try {
  manager.deleteProduct(nuevoProducto.id);
  console.log('Producto eliminado con éxito.');
} catch (error) {
  console.error('Error al eliminar producto:', error.message);
}
