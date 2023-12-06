const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

cartSchema.methods.calculateTotalAmount = async function () {
    await this.populate('products').execPopulate();
    let totalAmount = 0;

    this.products.forEach(product => {
        totalAmount += product.price;
    });

    return totalAmount;
};

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;


