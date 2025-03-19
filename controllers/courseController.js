const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const { validationResult } = require('express-validator');

// Create a new course
const createCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;
        const course = new Course({
            name,
            description,
            instructor: req.user.id
        });

        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Upload course material
const uploadMaterial = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        course.materials.push({
            title: req.body.title || req.file.originalname,
            fileUrl: req.file.path,
            uploadedBy: req.user.id
        });

        await course.save();
        res.status(201).json(course.materials[course.materials.length - 1]);
    } catch (error) {
        console.error('Error uploading material:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create assignment
const createAssignment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const assignment = new Assignment({
            ...req.body,
            course: courseId
        });

        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit assignment
const submitAssignment = async (req, res) => {
    try {
        const { courseId, assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.course.toString() !== courseId) {
            return res.status(400).json({ message: 'Invalid course for this assignment' });
        }

        const submission = {
            student: req.user.id,
            answers: req.body.answers
        };

        assignment.submissions.push(submission);
        await assignment.save();
        res.status(201).json(submission);
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get course details
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('instructor', 'name email')
            .populate('materials.uploadedBy', 'name email')
            .populate('students', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get student grades
const getStudentGrades = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            'submissions.student': req.user.id
        }).populate('course', 'name');

        const grades = assignments.map(assignment => ({
            courseName: assignment.course.name,
            assignmentTitle: assignment.title,
            score: assignment.submissions.find(s => s.student.toString() === req.user.id)?.score || 0,
            maxScore: assignment.maxScore
        }));

        res.json(grades);
    } catch (error) {
        console.error('Error getting grades:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createCourse,
    uploadMaterial,
    createAssignment,
    submitAssignment,
    getCourse,
    getStudentGrades
};