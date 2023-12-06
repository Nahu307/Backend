const express = require('express');
const router = express.Router();
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

// DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);

    // Eliminar el producto del carrito
    cart.products.pull(pid);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito exitosamente' });
} catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
}
});

// PUT api/carts/:cid - Actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true });

    res.json({ message: 'Carrito actualizado exitosamente', cart });
} catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error al actualizar carrito' });
}
});

// PUT api/carts/:cid/products/:pid - Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await CartModel.findById(cid);

    // Buscar y actualizar la cantidad del producto en el carrito
    const productIndex = cart.products.findIndex(p => p == pid);
    if (productIndex !== -1) {
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    }

    res.json({ message: 'Cantidad del producto actualizada exitosamente', cart });
} catch (error) {
    console.error('Error al actualizar cantidad del producto en el carrito:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad del producto en el carrito' });
}
});

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
try {
    const { cid } = req.params;
    await CartModel.findByIdAndUpdate(cid, { products: [] });

    res.json({ message: 'Todos los productos del carrito fueron eliminados' });
} catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
}
});

// GET api/carts/:cid - Traer todos los productos con referencias completas (populate)
router.get('/:cid', async (req, res) => {
try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('products');

    res.json(cart);
} catch (error) {
    console.error('Error al obtener carrito con productos completos:', error);
    res.status(500).json({ error: 'Error al obtener carrito con productos completos' });
}
});

module.exports = router;
