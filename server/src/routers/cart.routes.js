const cartRouter = require('express').Router();
const { getAllCartItems, getCartItem, createCartItem, updateCartItem, deleteCartItem } = require('../controllers/cart.controller');

cartRouter.get('/', getAllCartItems);
cartRouter.get('/:id', getCartItem);
cartRouter.post('/', createCartItem);
cartRouter.put('/:id', updateCartItem);
cartRouter.delete('/:id', deleteCartItem);

module.exports = cartRouter;