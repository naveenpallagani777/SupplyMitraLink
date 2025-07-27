const routes = require('express').Router();

const cartRouter = require('./cart.routes');
const materialRouter = require('./material.router');
const reviewRouter = require('./review.router');
const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const addressRouter = require('./address.router');
const orderRouter = require('./order.router');
const { protect } = require('../middlewares/auth.middleware');

routes.use('/auth', authRouter);

routes.use(protect); // Protect all routes in this router
routes.use('/cart', cartRouter);
routes.use('/material', materialRouter);
routes.use('/review', reviewRouter);
routes.use('/user', userRouter);
routes.use('/address', addressRouter);
routes.use('/order', orderRouter);

module.exports = routes;