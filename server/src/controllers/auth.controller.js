const catchAsync = require('../utils/catchAsync');
const APPError = require('../utils/appError');
const User = require('../models/user.model');
const jsonwebtoken = require('jsonwebtoken');
const { statusOK } = require('../utils/response.util');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (user) => {
    return jsonwebtoken.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new APPError('Email, password and role are required', 400));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new APPError('User already exists', 400));
    }
    const user = await User.create({ email, password, role });

    if (!user) {
        return next(new APPError('User creation failed', 500));
    }

    const token = generateToken(user);
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return statusOK(
        res,
        {
            id: user._id,
            email: user.email,
            role: user.role,
            token,
        },
        message = 'User created successfully'
    );

});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new APPError('Email, password and role are required', 400));
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return next(new APPError('Invalid email or password', 401));
    }
    const token = generateToken(user);
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    return statusOK(
        res,
        {
            id: user._id,
            email: user.email,
            role: user.role,
            token,
        },
        message = 'User logged in successfully'
    );
})