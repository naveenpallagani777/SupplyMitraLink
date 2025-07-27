const { getOneByFilter, updateOneByFilter } = require('./factory.controller');
const User = require('../models/user.model');

exports.getUserProfile = (req, res, next) => {
    return getOneByFilter(User, req => ({
        _id: req.user.id
    }))(req, res, next);
};

exports.updateUserProfile = (req, res, next) => {
    if (!req.body.password) {
        delete req.body.password;
    }
    if (!req.body.role) {
        delete req.body.role;
    }
    return updateOneByFilter(User, req => ({
        _id: req.user.id
    }))(req, res, next);
};