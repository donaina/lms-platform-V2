const express = require('express');
const { body } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth');
const { upload, handleFileUploadError } = require('../middleware/fileUpload');
const courseController = require('../controllers/courseController');
const Course = require('../models/Course');

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

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course (instructor only)
router.post('/', async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can create courses' });
  }

  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    instructor: req.user._id,
    duration: req.body.duration,
    level: req.body.level,
    prerequisites: req.body.prerequisites,
    materials: req.body.materials,
    schedule: req.body.schedule,
    capacity: req.body.capacity,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update course (instructor only)
router.patch('/:id', async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can update courses' });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete course (instructor only)
router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can delete courses' });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.remove();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in course (student only)
router.post('/:id/enroll', async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can enroll in courses' });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    if (course.students.length >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    course.students.push(req.user._id);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 