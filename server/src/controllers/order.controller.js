const Order = require('../models/order.model');
const { getOneByFilter, updateOneByFilter, createOne, deleteOneByFilter, getAllByFilter } = require('./factory.controller');

// 🔍 Get All Orders for a Vendor
exports.getAllVendorOrders = (req, res, next) => {
    return getAllByFilter(Order, req => ({
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

exports.getVendorOrder = (req, res, next) => {
    return getOneByFilter(Order, req => ({
        _id: req.params.id,
        vendorId: req.user.id // Ensure only vendor can access their order
    }), [
        { path: 'supplierId' },
        { path: 'materialId' },
        { path: 'vendorAddressId' },
        { path: 'supplierAddressId' }
    ]
    )(req, res, next);
}

// ➕ Create a New Order
exports.createVendorOrder = (req, res, next) => {
    req.body.vendorId = req.user.id; // Set vendorId from authenticated user
    return createOne(Order)(req, res, next);
}

// 📝 Update Order by ID
exports.updateVendorOrder = (req, res, next) => {
    return updateOneByFilter(Order, req => ({
        _id: req.params.id,
        vendorId: req.user.id // Ensure only vendor can update their order
    }))(req, res, next);
}

// 🔍 Get All Orders for a Supplier
exports.getAllSupplierOrders = (req, res, next) => {
    return getAllByFilter(Order, req => ({
        supplierId: req.user.id
    }), [
        {
            path: 'vendorId',
            select: 'fullname'
        },
        {
            path: 'materialId',
            select: 'name pricePerUnit'
        }
    ]
    )(req, res, next);
}

exports.getSupplierOrder = (req, res, next) => {
    return getOneByFilter(Order, req => ({
        _id: req.params.id,
        supplierId: req.user.id // Ensure only supplier can access their order
    }), [
        { path: 'vendorId' },
        { path: 'materialId' },
        { path: 'vendorAddressId' },
        { path: 'supplierAddressId' }
    ]
    )(req, res, next);
}