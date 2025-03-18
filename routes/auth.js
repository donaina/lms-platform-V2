const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
        .withMessage('Password must contain both letters and numbers'),
    body('role').isIn(['student', 'instructor', 'parent', 'admin']).withMessage('Invalid role'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);

module.exports = router; 