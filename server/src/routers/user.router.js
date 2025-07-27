const userRouter = require('express').Router();
const { getUserProfile, updateUserProfile, getMaterialsBySupplierId, getNearbySuppliers } = require('../controllers/user.controller');

userRouter.get('/profile', getUserProfile);
userRouter.put('/profile', updateUserProfile);

// vender routes
userRouter.get('/supplier/nearby', getNearbySuppliers);
userRouter.get('/supplier/:id', getMaterialsBySupplierId);



module.exports = userRouter;