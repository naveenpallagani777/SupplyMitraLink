const uploadRouter = require('express').Router();
const uploadController = require('../controllers/upload.controller');

// === Single Image Upload ===
// POST /api/upload/single
uploadRouter.post(
  '/single',
  uploadController.uploadSingleImage,
  uploadController.resizeSingleImage,
  uploadController.handleSingleUpload
);

// === Multiple Image Upload ===
// POST /api/upload/multiple
uploadRouter.post(
  '/multiple',
  uploadController.uploadMultipleImages,
  uploadController.resizeMultipleImages,
  uploadController.handleMultipleUpload
);

module.exports = uploadRouter;
