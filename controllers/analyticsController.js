const Course = require('../models/Course');
const User = require('../models/User');
const Communication = require('../models/Communication');

// Get school statistics
exports.getSchoolStats = async (req, res) => {
    try {
        const schoolId = req.user.school;

        const stats = {
            users: {
                total: await User.countDocuments({ school: schoolId }),
                students: await User.countDocuments({ school: schoolId, role: 'student' }),
                lecturers: await User.countDocuments({ school: schoolId, role: 'lecturer' }),
                parents: await User.countDocuments({ school: schoolId, role: 'parent' })
            },
            courses: {
                total: await Course.countDocuments({ school: schoolId }),
                active: await Course.countDocuments({ school: schoolId, isActive: true })
            },
            communications: {
                total: await Communication.countDocuments({ school: schoolId }),
                unread: await Communication.countDocuments({ 
                    school: schoolId,
                    status: 'sent'
                }),
                priority: {
                    high: await Communication.countDocuments({ 
                        school: schoolId,
                        priority: 'high'
                    }),
                    medium: await Communication.countDocuments({ 
                        school: schoolId,
                        priority: 'medium'
                    }),
                    low: await Communication.countDocuments({ 
                        school: schoolId,
                        priority: 'low'
                    })
                }
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get student performance report
exports.getStudentPerformance = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Verify access rights
        if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.user.role === 'parent') {
            const student = await User.findOne({
                _id: studentId,
                school: req.user.school
            });
            if (!student) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const courses = await Course.find({
            school: req.user.school,
            students: studentId
        }).select('name assignments');

        const performance = {
            courses: courses.map(course => ({
                courseName: course.name,
                assignments: course.assignments.map(assignment => ({
                    title: assignment.title,
                    score: assignment.submissions.find(
                        sub => sub.student.toString() === studentId
                    )?.score || 'Not submitted',
                    maxScore: assignment.maxScore,
                    submittedAt: assignment.submissions.find(
                        sub => sub.student.toString() === studentId
                    )?.submittedAt
                }))
            })),
            overall: {
                totalAssignments: courses.reduce((total, course) => 
                    total + course.assignments.length, 0),
                completedAssignments: courses.reduce((total, course) => 
                    total + course.assignments.reduce((count, assignment) => 
                        count + (assignment.submissions.some(
                            sub => sub.student.toString() === studentId
                        ) ? 1 : 0), 0), 0),
                averageScore: calculateAverageScore(courses, studentId)
            }
        };

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get course analytics
exports.getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            school: req.user.school
        }).populate('students', 'name');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const analytics = {
            totalStudents: course.students.length,
            assignments: course.assignments.map(assignment => ({
                title: assignment.title,
                submissions: assignment.submissions.length,
                averageScore: calculateAssignmentAverage(assignment),
                submissionRate: (assignment.submissions.length / course.students.length) * 100,
                scoreDistribution: calculateScoreDistribution(assignment)
            }))
        };

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper functions
const calculateAverageScore = (courses, studentId) => {
    let totalScore = 0;
    let totalMaxScore = 0;

    courses.forEach(course => {
        course.assignments.forEach(assignment => {
            const submission = assignment.submissions.find(
                sub => sub.student.toString() === studentId
            );
            if (submission) {
                totalScore += submission.score;
                totalMaxScore += assignment.maxScore;
            }
        });
    });

    return totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
};

const calculateAssignmentAverage = (assignment) => {
    if (assignment.submissions.length === 0) return 0;
    const total = assignment.submissions.reduce((sum, sub) => sum + sub.score, 0);
    return total / assignment.submissions.length;
};

const calculateScoreDistribution = (assignment) => {
    const distribution = {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0
    };

    assignment.submissions.forEach(submission => {
        const percentage = (submission.score / assignment.maxScore) * 100;
        if (percentage <= 20) distribution['0-20']++;
        else if (percentage <= 40) distribution['21-40']++;
        else if (percentage <= 60) distribution['41-60']++;
        else if (percentage <= 80) distribution['61-80']++;
        else distribution['81-100']++;
    });

    return distribution;
}; 