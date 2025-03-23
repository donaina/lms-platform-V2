const express = require('express');
const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 