# Learning Management System (LMS) Platform V2

A modern, full-stack Learning Management System built with React and Node.js. This platform provides a comprehensive solution for managing online courses, assignments, and student progress.

## Features

- 🔐 User Authentication & Authorization
- 📚 Course Management
- ✍️ Assignment Tracking
- 💬 Real-time Messaging
- 📊 Analytics Dashboard
- 👤 User Profile Management
- 🔔 Notifications System

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Axios
- Context API for State Management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/donaina/lms-platform-V2.git
cd lms-platform-V2
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create environment variables:

Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd server
node index.js
```
The server will run on http://localhost:5000

2. Start the frontend development server:
```bash
cd client
npm start
```
The frontend will run on http://localhost:3006

## Project Structure

```
lms-platform-V2/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/       # Context providers
│       ├── pages/         # Page components
│       └── App.js         # Main application component
│
└── server/                # Backend Node.js application
    ├── middleware/        # Custom middleware
    ├── models/           # Database models
    ├── routes/           # API routes
    └── index.js          # Server entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Courses
- GET `/api/courses` - Get all courses
- POST `/api/courses` - Create new course
- GET `/api/courses/:id` - Get course details

### Assignments
- GET `/api/assignments` - Get user assignments
- POST `/api/assignments` - Create new assignment
- PUT `/api/assignments/:id` - Update assignment

### Messages
- GET `/api/messages` - Get user messages
- POST `/api/messages` - Send new message

### Analytics
- GET `/api/analytics` - Get user analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@donaina](https://github.com/donaina)

Project Link: [https://github.com/donaina/lms-platform-V2](https://github.com/donaina/lms-platform-V2) 