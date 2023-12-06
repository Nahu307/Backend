const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Elimina espacios en blanco al inicio y final
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Precio no puede ser negativo
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Other'] 
    },
    available: {
        type: Boolean,
        default: true // Valor predeterminado si no se proporciona
    },
    
}, {
    timestamps: true 
});

// Define un índice para mejorar la velocidad de búsqueda
productSchema.index({ name: 'text', category: 1 });

// Método personalizado para calcular el precio con descuento
productSchema.methods.calculateDiscountedPrice = function (discountPercentage) {
    return this.price - (this.price * (discountPercentage / 100));
};

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;

