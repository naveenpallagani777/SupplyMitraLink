const { getOneByFilter, updateOneByFilter, createOne, deleteOneByFilter, getAllByFilter } = require('./factory.controller');
const User = require('../models/user.model');
const Material = require('../models/material.model');
const Address = require('../models/address.model');
const APPError = require('../utils/appError');

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

// vender controllers

exports.getMaterialsBySupplierId = (req, res, next) => {
    return getAllByFilter(Material, req => ({
        supplierId: req.params.id
    }))(req, res, next);
}

exports.getNearbySuppliers = async (req, res, next) => {
    const { lng, lat, max = 10000 } = req.query;

    if (!lng || !lat) {
        return new APPError('Please provide both longitude and latitude', 400);
    }

    const radius = parseFloat(max) / 6378.1; // Earth's radius in km

    return getAllByFilter(Address, req => ({
        location: {
            $geoWithin: {
                $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
            }
        }
    }), {
        path: 'userId',
        match: { role: 'supplier' }, // 🔍 Only return if user is supplier
        select: 'name email role fullname'     // Choose what to return
    })(req, res, next);
};