// models/Material.js
const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
	supplierId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	images: [{
		type: String,
		required: true
	}],
	name: {
		type: String,
		required: true,
		trim: true
	},
	pricePerUnit: {
		type: Number,
		required: true,
	},
	availableQuantity: {
		type: Number,
		required: true,
	},
	unit: {
		type: String,
		enum: ['kg', 'g', 'litre', 'ml', 'piece'],
		default: 'kg',
	},
	category: {
		type: String,
		enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Others'],
		default: 'Vegetables',
	},
});

const Material = mongoose.model('Material', MaterialSchema);

module.exports = Material;
