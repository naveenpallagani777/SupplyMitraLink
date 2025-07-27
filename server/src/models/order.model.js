// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // vendor who places the order
        required: true,
    },

    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // supplier who receives the order
        required: true,
    },

    vendorAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', // address of the vendor
        required: true,
    },

    supplierAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', // address of the supplier
        required: true,
    },

    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material', // material being ordered
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered'],
        default: 'pending',
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);
