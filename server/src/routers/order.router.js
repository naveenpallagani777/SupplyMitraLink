const orderRouter = require('express').Router();
const { getAllVendorOrders, getVendorOrder, createVendorOrder, updateVendorOrder, getAllSupplierOrders, getSupplierOrder } = require('../controllers/order.controller');
const { restrictTo } = require('../middlewares/auth.middleware');


orderRouter.get('/vendor', restrictTo('vendor'), getAllVendorOrders);
orderRouter.get('/vendor/:id', restrictTo('vendor'), getVendorOrder);
orderRouter.post('/vendor', restrictTo('vendor'), createVendorOrder);
orderRouter.put('/vendor/:id', restrictTo('vendor'), updateVendorOrder);

orderRouter.get('/supplier', restrictTo('supplier'), getAllSupplierOrders);
orderRouter.get('/supplier/:id', restrictTo('supplier'), getSupplierOrder);

module.exports = orderRouter;