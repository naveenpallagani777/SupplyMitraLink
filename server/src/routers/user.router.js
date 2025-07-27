const userRouter = require('express').Router();
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');

userRouter.get('/profile', getUserProfile);
userRouter.put('/profile', updateUserProfile);

module.exports = userRouter;