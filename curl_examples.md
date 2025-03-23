# LMS Platform V2 - cURL Examples

## Authentication

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## User Endpoints

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User Profile
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

## Course Endpoints

### Get All Courses
```bash
curl -X GET "http://localhost:5000/api/courses?page=1&limit=10&search=react&category=programming" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Course Details
```bash
curl -X GET http://localhost:5000/api/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=React Fundamentals" \
  -F "description=Learn React from scratch" \
  -F "category=programming" \
  -F "duration=10 weeks" \
  -F "thumbnail=@/path/to/thumbnail.jpg"
```

## Assignment Endpoints

### Get User Assignments
```bash
curl -X GET "http://localhost:5000/api/assignments?status=pending&course=COURSE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Submit Assignment
```bash
curl -X POST http://localhost:5000/api/assignments/ASSIGNMENT_ID/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "submission=@/path/to/assignment.pdf" \
  -F "comments=Assignment submission comments"
```

## Messages Endpoints

### Get User Conversations
```bash
curl -X GET http://localhost:5000/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Conversation Messages
```bash
curl -X GET http://localhost:5000/api/messages/CONVERSATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Message
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "CONVERSATION_ID",
    "content": "Hello, how are you?"
  }'
```

## Analytics Endpoints

### Get User Analytics
```bash
curl -X GET http://localhost:5000/api/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## PowerShell Examples

For Windows PowerShell users, here are equivalent commands:

### Register User (PowerShell)
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    role = "student"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Submit Assignment (PowerShell)
```powershell
$form = @{
    submission = Get-Item -Path "C:\path\to\assignment.pdf"
    comments = "Assignment submission comments"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/assignments/ASSIGNMENT_ID/submit" `
  -Method Post `
  -Headers @{"Authorization" = "Bearer YOUR_JWT_TOKEN"} `
  -Form $form
```

## Tips

1. Replace `YOUR_JWT_TOKEN` with the actual token received from login/register
2. Replace `COURSE_ID`, `ASSIGNMENT_ID`, and `CONVERSATION_ID` with actual IDs
3. For file uploads, replace `/path/to/file` with actual file paths
4. For Windows users, use PowerShell examples or escape quotes differently in cmd:
   ```cmd
   curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
   ``` 