const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Protected routes
router.use(auth);

// School statistics (admin only)
router.get('/school-stats',
    checkRole('admin'),
    analyticsController.getSchoolStats
);

// Student performance (accessible by student, parent, lecturer, admin)
router.get('/student-performance/:studentId',
    checkRole('student', 'parent', 'lecturer', 'admin'),
    analyticsController.getStudentPerformance
);

// Course analytics (accessible by lecturer and admin)
router.get('/course/:courseId',
    checkRole('lecturer', 'admin'),
    analyticsController.getCourseAnalytics
);

module.exports = router; 