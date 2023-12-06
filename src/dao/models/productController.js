const ProductModel = require('../models/productModel');

const getProducts = async (req, res) => {
    try {
    const { limit = 10, page = 1, sort, query, category, available } = req.query;

    let filter = {};

    if (query) {
    filter = { name: { $regex: new RegExp(query, 'i') } };
    }

    if (category) {
    filter.category = category;
    }

    if (available) {
    filter.available = available === 'true' ? true : false;
    }

    let productsQuery = ProductModel.find(filter);

    if (sort) {
    const sortOrder = sort === 'asc' ? 1 : -1;
    productsQuery = productsQuery.sort({ price: sortOrder });
    }

    const totalProductsCount = await ProductModel.countDocuments(filter);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    productsQuery = productsQuery.skip(startIndex).limit(limit);

    const products = await productsQuery.exec();

    const totalPages = Math.ceil(totalProductsCount / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = endIndex < totalProductsCount;
    const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${page - 1}` : null;
    const nextLink = hasNextPage ? `/products?limit=${limit}&page=${page + 1}` : null;

    const responseObject = {
        status: 'success',
        payload: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page: page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    };

    res.json(responseObject);
} catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
}
};

module.exports = {
getProducts,
};
