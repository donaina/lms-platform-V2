const express = require('express');
const router = express.Router();

// Get analytics data
router.get('/', async (req, res) => {
  try {
    res.json({
      courseProgress: [
        {
          courseId: '1',
          title: 'Introduction to Web Development',
          progress: 60,
          totalLessons: 24,
          completedLessons: 14,
          image: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg'
        },
        {
          courseId: '2',
          title: 'Advanced React Development',
          progress: 30,
          totalLessons: 32,
          completedLessons: 10,
          image: 'https://img.freepik.com/free-vector/react-native-mobile-development-abstract-concept-illustration_335657-5830.jpg'
        }
      ],
      assignmentStats: [
        {
          type: 'Completed',
          count: 5,
          averageScore: 92
        },
        {
          type: 'Pending',
          count: 2
        },
        {
          type: 'Late',
          count: 1,
          averageScore: 75
        }
      ],
      learningTime: {
        total: 45,
        thisWeek: 12,
        today: 2,
        byDay: [
          { day: 'Monday', hours: 3 },
          { day: 'Tuesday', hours: 2 },
          { day: 'Wednesday', hours: 4 },
          { day: 'Thursday', hours: 1 },
          { day: 'Friday', hours: 2 }
        ]
      },
      achievements: [
        {
          id: '1',
          title: 'Fast Learner',
          description: 'Completed 5 lessons in one day',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          icon: 'https://img.freepik.com/free-vector/golden-badge-with-laurel-wreath_1017-4324.jpg'
        }
      ],
      charts: {
        progressChart: 'https://img.freepik.com/free-vector/business-data-visualization-concept_23-2148666169.jpg',
        timeSpentChart: 'https://img.freepik.com/free-vector/infographic-elements-statistics_23-2148523553.jpg',
        assignmentScoresChart: 'https://img.freepik.com/free-vector/business-data-graphs-charts-statistics_23-2148666165.jpg'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 