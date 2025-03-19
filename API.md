# LMS Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "instructor" | "parent" | "admin",
  "phoneNumber": "string" (optional)
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phoneNumber": "string"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phoneNumber": "string"
  }
}
```

#### Get User Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "phoneNumber": "string"
}
```

### Courses

#### Get All Courses
```http
GET /courses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "instructor": {
      "id": "string",
      "name": "string"
    },
    "students": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Create Course
```http
POST /courses
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "instructor": {
    "id": "string",
    "name": "string"
  },
  "students": [],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Assignments

#### Get Course Assignments
```http
GET /courses/:courseId/assignments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "dueDate": "string",
    "course": {
      "id": "string",
      "title": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

#### Create Assignment
```http
POST /courses/:courseId/assignments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "dueDate": "string",
  "course": {
    "id": "string",
    "title": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:
- 100 requests per 15 minutes per IP address
- 1000 requests per hour per user

## WebSocket Events

The API also provides real-time updates through WebSocket connections:

### Connection
```
ws://localhost:5000
```

### Events

#### New Assignment
```json
{
  "type": "NEW_ASSIGNMENT",
  "data": {
    "id": "string",
    "title": "string",
    "courseId": "string"
  }
}
```

#### Assignment Update
```json
{
  "type": "ASSIGNMENT_UPDATE",
  "data": {
    "id": "string",
    "title": "string",
    "courseId": "string"
  }
}
```

#### New Message
```json
{
  "type": "NEW_MESSAGE",
  "data": {
    "id": "string",
    "content": "string",
    "sender": {
      "id": "string",
      "name": "string"
    }
  }
}
``` 