const express = require('express');
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      avatar: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
      bio: 'Passionate learner | Software Engineering Student',
      location: 'New York, USA',
      enrolledCourses: [
        {
          _id: '1',
          title: 'Introduction to Web Development',
          progress: 60,
          image: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg'
        },
        {
          _id: '2',
          title: 'Advanced React Development',
          progress: 30,
          image: 'https://img.freepik.com/free-vector/react-native-mobile-development-abstract-concept-illustration_335657-5830.jpg'
        }
      ],
      completedAssignments: [
        {
          _id: '1',
          title: 'HTML Basics Quiz',
          score: 95,
          courseId: '1'
        }
      ],
      achievements: [
        {
          id: '1',
          title: 'Fast Learner',
          description: 'Completed 5 lessons in one day',
          icon: 'https://img.freepik.com/free-vector/golden-badge-with-laurel-wreath_1017-4324.jpg'
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 