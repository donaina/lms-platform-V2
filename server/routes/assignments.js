const express = require('express');
const router = express.Router();

// Get all assignments
router.get('/', async (req, res) => {
  try {
    res.json([
      {
        _id: '1',
        title: 'Build a React Component',
        description: 'Create a reusable React component with proper TypeScript typing and styling.',
        course: { 
          _id: '1', 
          title: 'Introduction to Web Development',
          image: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg'
        },
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        maxScore: 100,
        requirements: [
          'Use functional components with TypeScript',
          'Implement proper props interface',
          'Add Material-UI styling',
          'Include unit tests'
        ],
        resources: [
          {
            title: 'React Documentation',
            url: 'https://reactjs.org/docs',
            icon: 'https://img.freepik.com/free-vector/documentation-concept-illustration_114360-5399.jpg'
          }
        ],
        attachments: [
          {
            name: 'assignment_template.tsx',
            url: '#',
            icon: 'https://img.freepik.com/free-vector/file-concept-illustration_114360-4947.jpg'
          }
        ],
        status: 'pending',
        points: 100,
        type: 'Project',
        difficulty: 'Intermediate',
        estimatedTime: '3 hours'
      },
      {
        _id: '2',
        title: 'Data Visualization Dashboard',
        description: 'Create a dashboard using React and Recharts to visualize course data.',
        course: { 
          _id: '2', 
          title: 'Advanced React Development',
          image: 'https://img.freepik.com/free-vector/react-native-mobile-development-abstract-concept-illustration_335657-5830.jpg'
        },
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        maxScore: 100,
        requirements: [
          'Use Recharts library',
          'Create at least 3 different types of charts',
          'Implement data filtering',
          'Add responsive design'
        ],
        resources: [
          {
            title: 'Recharts Documentation',
            url: 'https://recharts.org',
            icon: 'https://img.freepik.com/free-vector/documentation-concept-illustration_114360-5399.jpg'
          }
        ],
        attachments: [],
        status: 'pending',
        points: 100,
        type: 'Project',
        difficulty: 'Advanced',
        estimatedTime: '5 hours'
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 