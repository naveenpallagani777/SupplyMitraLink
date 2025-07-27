const addressRouter = require('express').Router();
const { getAllAddresses, getAddress, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller');

addressRouter.get('/', getAllAddresses);
addressRouter.get('/:id', getAddress);
addressRouter.post('/', createAddress);
addressRouter.put('/:id', updateAddress);
addressRouter.delete('/:id', deleteAddress);

module.exports = addressRouter;