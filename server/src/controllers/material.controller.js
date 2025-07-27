const { getOneByFilter, updateOneByFilter, createOne, deleteOneByFilter, getAllByFilter } = require('./factory.controller');
const Material = require('../models/material.model');

exports.getAllMaterials = (req, res, next) => {
    return getAllByFilter(Material, req => ({
        supplierId: req.user.id
    }))(req, res, next);
}

exports.getMaterial = (req, res, next) => {
    return getOneByFilter(Material, req => ({
        _id: req.params.id
    }))(req, res, next);
}

exports.createMaterial = (req, res, next) => {
    req.body.supplierId = req.user.id;
    return createOne(Material)(req, res, next);
}

exports.updateMaterial = (req, res, next) => {
    return updateOneByFilter(Material, req => ({
        _id: req.params.id,
        supplierId: req.user.id
    }))(req, res, next);
}

exports.deleteMaterial = (req, res, next) => {
    return deleteOneByFilter(Material, req => ({
        _id: req.params.id,
        supplierId: req.user.id
    }))(req, res, next);
}