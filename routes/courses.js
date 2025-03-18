const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth');
const { upload, handleFileUploadError } = require('../middleware/fileUpload');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Validation middleware
const courseValidation = [
    body('name').trim().notEmpty().withMessage('Course name is required'),
    body('description').trim().optional()
];

const assignmentValidation = [
    body('title').trim().notEmpty().withMessage('Assignment title is required'),
    body('description').trim().notEmpty().withMessage('Assignment description is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('maxScore').isNumeric().withMessage('Maximum score must be a number'),
    body('questions').isArray().withMessage('Questions must be an array'),
    body('questions.*.question').notEmpty().withMessage('Question text is required'),
    body('questions.*.type').isIn(['multiple_choice', 'true_false', 'short_answer']).withMessage('Invalid question type'),
    body('questions.*.options').optional().isArray(),
    body('questions.*.correctAnswer').notEmpty().withMessage('Correct answer is required'),
    body('questions.*.score').isNumeric().withMessage('Question score must be a number')
];

// Protected routes
router.use(auth);

// Course routes
router.post('/', 
    checkRole('instructor', 'admin'),
    courseValidation,
    courseController.createCourse
);

router.post('/:courseId/materials',
    checkRole('instructor', 'admin'),
    upload.single('file'),
    handleFileUploadError,
    courseController.uploadMaterial
);

router.post('/:courseId/assignments',
    checkRole('instructor', 'admin'),
    assignmentValidation,
    courseController.createAssignment
);

router.post('/:courseId/assignments/:assignmentId/submit',
    checkRole('student'),
    courseController.submitAssignment
);

router.get('/:courseId',
    courseController.getCourse
);

router.get('/student/grades',
    checkRole('student'),
    courseController.getStudentGrades
);

module.exports = router; 