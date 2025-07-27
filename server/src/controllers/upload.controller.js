const sharp = require('sharp');
const multer = require('multer');
const APPError = require('../utils/appError');

// === 1. Multer Setup ===
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new APPError('Only image files are allowed!', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// === 2. Middleware for Uploading ===
exports.uploadSingleImage = upload.single('image'); // expects field 'image'
exports.uploadMultipleImages = upload.array('images', 5); // expects field 'images'

// === 3. Resize Single Image ===
exports.resizeSingleImage = async (req, res, next) => {
    if (!req.file) return next();

    const filename = `user-${Date.now()}.jpeg`;
    req.file.filename = filename;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/uploads/${filename}`);

    next();
};

// === 4. Resize Multiple Images ===
exports.resizeMultipleImages = async (req, res, next) => {
    if (!req.files || !req.files.length) return next();

    req.body.images = [];

    await Promise.all(
        req.files.map(async (file, i) => {
            const filename = `gallery-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/uploads/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
};

// === 5. Final Controllers to Send Response ===
exports.handleSingleUpload = (req, res) => {
    res.status(200).json({
        status: 'success',
        file: req.file.filename,
    });
};

exports.handleMultipleUpload = (req, res) => {
    res.status(200).json({
        status: 'success',
        files: req.body.images,
    });
};
