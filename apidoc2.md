# LMS Platform V2 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string (student/instructor/admin)"
}
```

**Response (200):**
```json
{
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Login
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

**Response (200):**
```json
{
  "token": "jwt_token",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

## User Endpoints

### Get User Profile
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "enrolledCourses": ["Course"],
    "completedCourses": ["Course"]
  }
}
```

### Update User Profile
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "string",
  "currentPassword": "string",
  "newPassword": "string"
}
```

## Course Endpoints

### Get All Courses
```http
GET /courses
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 10)
search: string
category: string
```

**Response (200):**
```json
{
  "courses": [{
    "_id": "string",
    "title": "string",
    "description": "string",
    "instructor": {
      "_id": "string",
      "name": "string"
    },
    "thumbnail": "string",
    "duration": "string",
    "category": "string",
    "enrolledStudents": number
  }],
  "totalPages": number,
  "currentPage": number
}
```

### Get Course Details
```http
GET /courses/:id
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "course": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "instructor": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "modules": [{
      "_id": "string",
      "title": "string",
      "content": "string",
      "resources": ["string"]
    }],
    "assignments": ["Assignment"],
    "enrolledStudents": ["User"]
  }
}
```

### Create Course
```http
POST /courses
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "duration": "string",
  "thumbnail": "file"
}
```

## Assignment Endpoints

### Get User Assignments
```http
GET /assignments
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
status: string (pending/completed/overdue)
course: string (course_id)
```

**Response (200):**
```json
{
  "assignments": [{
    "_id": "string",
    "title": "string",
    "description": "string",
    "course": {
      "_id": "string",
      "title": "string"
    },
    "dueDate": "date",
    "status": "string",
    "score": number
  }]
}
```

### Submit Assignment
```http
POST /assignments/:id/submit
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "submission": "file",
  "comments": "string"
}
```

## Messages Endpoints

### Get User Conversations
```http
GET /messages/conversations
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "conversations": [{
    "_id": "string",
    "participant": {
      "_id": "string",
      "name": "string",
      "avatar": "string"
    },
    "lastMessage": {
      "content": "string",
      "timestamp": "date"
    },
    "unreadCount": number
  }]
}
```

### Get Conversation Messages
```http
GET /messages/:conversationId
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "messages": [{
    "_id": "string",
    "sender": {
      "_id": "string",
      "name": "string"
    },
    "content": "string",
    "timestamp": "date",
    "read": boolean
  }]
}
```

### Send Message
```http
POST /messages
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "conversationId": "string",
  "content": "string"
}
```

## Analytics Endpoints

### Get User Analytics
```http
GET /analytics
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "totalCourses": number,
  "completedCourses": number,
  "totalAssignments": number,
  "averageGrade": number,
  "courseProgress": [{
    "id": "string",
    "name": "string",
    "progress": number
  }],
  "recentActivity": [{
    "id": "string",
    "type": "string",
    "description": "string",
    "timestamp": "date"
  }]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Rate limit: 100 requests per IP per 15 minutes
- Rate limit headers included in responses:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

The token is obtained through the login or register endpoints and should be included in all subsequent requests.

## File Upload Limits

- Maximum file size: 5MB
- Supported formats for assignments: pdf, doc, docx, txt
- Supported formats for course thumbnails: jpg, jpeg, png 