const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth');
const { upload, handleFileUploadError } = require('../middleware/fileUpload');
const communicationController = require('../controllers/communicationController');

const router = express.Router();

// Validation middleware
const messageValidation = [
    body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority level')
];

const replyValidation = [
    body('message').trim().notEmpty().withMessage('Reply message is required')
];

// Protected routes
router.use(auth);

// Message routes
router.post('/',
    checkRole('parent', 'lecturer', 'admin'),
    upload.single('attachment'),
    messageValidation,
    handleFileUploadError,
    communicationController.sendMessage
);

router.post('/:messageId/reply',
    replyValidation,
    communicationController.replyToMessage
);

router.get('/',
    communicationController.getMessages
);

router.patch('/:messageId/read',
    communicationController.markAsRead
);

module.exports = router; 