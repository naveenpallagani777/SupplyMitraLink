const Cart = require('../models/cart.model');
const { getAllByFilter, getOneByFilter, createOne, updateOneByFilter, deleteOneByFilter } = require('./factory.controller');

// 🔍 Get All Carts for a Vendor
exports.getAllCartItems = (req, res, next) => {
    return getAllByFilter(Cart, req => ({
        vendorId: req.user.id
    }), [
        {
            path: 'supplierId',
            select: 'fullname'
        },
        {
            path: 'materialId',
            select: 'name pricePerUnit'
        }
    ]
    )(req, res, next);
}

// 🔍 Get One Cart by ID
exports.getCartItem = (req, res, next) => {
    return getOneByFilter(Cart, req => ({
        _id: req.params.id,
        vendorId: req.user.id // Ensure only vendor can access their cart
    }), [
        {
            path: 'supplierId',
        },
        {
            path: 'materialId',
        }
    ]
    )(req, res, next);
}

// ➕ Create a New Cart
exports.createCartItem = (req, res, next) => {
    req.body.vendorId = req.user.id; // Set vendorId from authenticated user
    return createOne(Cart)(req, res, next);
}

// 📝 Update Cart by ID
exports.updateCartItem = (req, res, next) => {
    return updateOneByFilter(Cart, req => ({
        _id: req.params.id,
        vendorId: req.user.id // Ensure only vendor can update their cart
    }))(req, res, next);
}

// ✅ Delete Cart by ID
exports.deleteCartItem = (req, res, next) => {
    return deleteOneByFilter(Cart, req => ({
        _id: req.params.id,
        vendorId: req.user.id // Ensure only vendor can delete their cart
    }))(req, res, next);
}
