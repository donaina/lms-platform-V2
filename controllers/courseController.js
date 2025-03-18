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

module.exports = { createCourse };