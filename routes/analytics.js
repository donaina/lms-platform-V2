const express = require('express');
const { auth, checkRole } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

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

// Get overall platform statistics
router.get('/platform', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    const averageCourseEnrollment = await Course.aggregate([
      { $group: { _id: null, avg: { $avg: { $size: '$students' } } } }
    ]);

    const courseCompletionRate = await Course.aggregate([
      { $group: { _id: null, avg: { $avg: '$completionRate' } } }
    ]);

    res.json({
      totalStudents,
      totalInstructors,
      totalCourses,
      totalAssignments,
      averageCourseEnrollment: averageCourseEnrollment[0]?.avg || 0,
      courseCompletionRate: courseCompletionRate[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course-specific analytics
router.get('/course/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('students', 'name email')
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignments = await Assignment.find({ course: req.params.courseId });
    
    const assignmentStats = assignments.map(assignment => ({
      title: assignment.title,
      totalSubmissions: assignment.submissions.length,
      averageScore: assignment.submissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / 
                   (assignment.submissions.length || 1),
      submissionRate: (assignment.submissions.length / course.students.length) * 100
    }));

    const studentProgress = course.students.map(student => ({
      student: student.name,
      assignmentsCompleted: assignments.filter(a => 
        a.submissions.some(s => s.student.toString() === student._id.toString())
      ).length,
      averageScore: assignments.reduce((acc, a) => {
        const submission = a.submissions.find(s => s.student.toString() === student._id.toString());
        return acc + (submission?.score || 0);
      }, 0) / (assignments.length || 1)
    }));

    res.json({
      courseInfo: {
        title: course.title,
        instructor: course.instructor.name,
        totalStudents: course.students.length,
        enrollmentRate: (course.students.length / course.capacity) * 100
      },
      assignmentStats,
      studentProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student-specific analytics
router.get('/student/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const enrolledCourses = await Course.find({ students: req.params.studentId });
    const assignments = await Assignment.find({
      course: { $in: enrolledCourses.map(c => c._id) }
    });

    const courseProgress = enrolledCourses.map(course => ({
      courseTitle: course.title,
      progress: (course.completedModules?.length || 0) / (course.totalModules || 1) * 100
    }));

    const assignmentPerformance = assignments.map(assignment => ({
      title: assignment.title,
      course: assignment.course.title,
      score: assignment.submissions.find(s => s.student.toString() === req.params.studentId)?.score || 0,
      maxScore: assignment.maxScore,
      submittedAt: assignment.submissions.find(s => s.student.toString() === req.params.studentId)?.submittedAt
    }));

    const averageScore = assignmentPerformance.reduce((acc, curr) => acc + curr.score, 0) / 
                        (assignmentPerformance.length || 1);

    res.json({
      studentInfo: {
        name: student.name,
        email: student.email,
        enrolledCourses: enrolledCourses.length
      },
      courseProgress,
      assignmentPerformance,
      averageScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 