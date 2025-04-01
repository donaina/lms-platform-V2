const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

// Get all assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('course', 'title')
      .populate('submissions.student', 'name email');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title')
      .populate('submissions.student', 'name email');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create assignment (instructor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can create assignments' });
  }

  const assignment = new Assignment({
    title: req.body.title,
    description: req.body.description,
    course: req.body.courseId,
    dueDate: req.body.dueDate,
    maxScore: req.body.maxScore,
    type: req.body.type,
    requirements: req.body.requirements,
    attachments: req.body.attachments,
    //to include min required score
  });

  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update assignment (instructor only)
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can update assignments' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete assignment (instructor only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can delete assignments' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.remove();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment (student only)
router.post('/:id/submit', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can submit assignments' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = {
      student: req.user._id,
      content: req.body.content,
      attachments: req.body.attachments,
      submittedAt: new Date(),
    };

    assignment.submissions.push(submission);
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade submission (instructor only)
router.post('/:id/submissions/:submissionId/grade', auth, async (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can grade submissions' });
  }

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.score = req.body.score;
    submission.feedback = req.body.feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 