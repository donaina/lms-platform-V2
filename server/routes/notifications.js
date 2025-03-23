const express = require('express');
const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    res.json([
      {
        _id: '1',
        type: 'assignment',
        title: 'New Assignment Available',
        message: 'A new assignment "Build a React Component" has been posted in Web Development course.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: 'https://img.freepik.com/free-vector/new-message-concept-illustration_114360-666.jpg',
        link: '/assignments/1'
      },
      {
        _id: '2',
        type: 'course',
        title: 'Course Progress Update',
        message: 'You\'ve completed 60% of Introduction to Web Development!',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: 'https://img.freepik.com/free-vector/progress-concept-illustration_114360-1532.jpg',
        link: '/courses/1'
      },
      {
        _id: '3',
        type: 'achievement',
        title: 'New Achievement Unlocked',
        message: 'Congratulations! You\'ve earned the "Fast Learner" badge.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: 'https://img.freepik.com/free-vector/golden-badge-with-laurel-wreath_1017-4324.jpg',
        link: '/profile#achievements'
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 