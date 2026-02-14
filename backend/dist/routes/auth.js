"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
// Generate JWT Token
const generateToken = (userId) => {
    const expiresIn = (process.env.JWT_EXPIRE || '7d');
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn
    });
};
// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
    (0, express_validator_1.body)('username').trim().isLength({ min: 2, max: 20 }).withMessage('Username must be 2-20 characters'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('yearLevel').optional().isIn([3, 7]).withMessage('Year level must be 3 or 7')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { username, email, password, yearLevel } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }
        // Create user
        const user = await User_1.default.create({
            username,
            email,
            password,
            yearLevel,
            avatar: ['👦', '👧', '🧒', '👶', '🧑', '🐱', '🐶', '🐼'][Math.floor(Math.random() * 8)]
        });
        // Generate token
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                yearLevel: user.yearLevel,
                preferences: user.preferences
            }
        });
    }
    catch (error) {
        logger_1.default.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    (0, express_validator_1.body)('username').trim().notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { username, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Generate token
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                yearLevel: user.yearLevel,
                preferences: user.preferences
            }
        });
    }
    catch (error) {
        logger_1.default.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map