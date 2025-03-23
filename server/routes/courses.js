const express = require('express');
const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    res.json([
      {
        _id: '1',
        title: 'Introduction to Web Development',
        instructor: 'Dr. Sarah Johnson',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Build responsive websites and understand modern web development practices.',
        category: 'Programming',
        level: 'Beginner',
        price: 49.99,
        duration: '6 weeks',
        enrolled: 120,
        rating: 4.5,
        image: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg',
        isBookmarked: false,
        progress: 0,
        topics: ['HTML5', 'CSS3', 'JavaScript Basics', 'Responsive Design']
      },
      {
        _id: '2',
        title: 'Advanced React Development',
        instructor: 'Prof. Michael Chen',
        description: 'Master React.js and modern web development. Learn hooks, context, Redux, and build full-stack applications with Next.js.',
        category: 'Programming',
        level: 'Advanced',
        price: 79.99,
        duration: '8 weeks',
        enrolled: 85,
        rating: 4.8,
        image: 'https://img.freepik.com/free-vector/react-native-mobile-development-abstract-concept-illustration_335657-5830.jpg',
        isBookmarked: false,
        progress: 0,
        topics: ['React Hooks', 'Context API', 'Redux', 'Next.js']
      },
      {
        _id: '3',
        title: 'Data Science Fundamentals',
        instructor: 'Dr. Emily Martinez',
        description: 'Introduction to data science using Python. Learn data analysis, visualization, and machine learning basics.',
        category: 'Data Science',
        level: 'Intermediate',
        price: 69.99,
        duration: '10 weeks',
        enrolled: 150,
        rating: 4.7,
        image: 'https://img.freepik.com/free-vector/data-science-analytics-technology-innovation-concept-illustration_53876-17904.jpg',
        isBookmarked: false,
        progress: 0,
        topics: ['Python', 'Pandas', 'NumPy', 'Matplotlib']
      },
      {
        _id: '4',
        title: 'UI/UX Design Principles',
        instructor: 'Lisa Wong',
        description: 'Learn modern UI/UX design principles and tools. Create beautiful, user-friendly interfaces.',
        category: 'Design',
        level: 'Beginner',
        price: 59.99,
        duration: '6 weeks',
        enrolled: 95,
        rating: 4.6,
        image: 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg',
        isBookmarked: false,
        progress: 0,
        topics: ['Design Thinking', 'Figma', 'Prototyping', 'User Research']
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 