
# 📝 To-do List API

Tired of juggling tasks in your head? Well, stress no more!

I raise you this powerful task management API that turns chaos into order. 

Features JWT auth, task prioritization, smart search, and team collaboration— perfect for both production apps and learning modern API development.

## ✨ Features
- 🔐 User authentication & authorization
- 🎯 Task prioritization & categories
- 🔍 Advanced search & filtering
- ⚡ Bulk operations
- 📊 Task statistics & tracking
- 📱 Pagination support

## 🛠️ Built With
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS enabled

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running
- Your preferred API testing tool (e.g., Postman)

### Setup & Installation 

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
   - Create a new file named `.env` in the root directory
   - Add the following configurations:
```env
# Required configurations
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
PORT=3000
```

3. **Start the server**
```bash
npm run start or npx nodemon index.js //assuming you'll install nodemon along with the other dependencies
```

## API Usage 🤓😉

### 🔑 Authentication
First, you'll need to create an account and get your access token. This token is your key to all task-related operations.

1. **Create an Account**
```json
POST /api/users/register
{
    "username": "user",
    "email": "user@example.com",
    "password": "password123"
}

// Response includes your access token 🎉
{
    "user": {
        "id": "user_id",
        "username": "user",
        "email": "user@example.com"
    },
    "token": "your_access_token_here"
}
```

2. **Login**
```json
POST /api/users/login
{
    "email": "user@example.com",
    "password": "password123"
}
```

3. **Using Your Token**
```http
Authorization: Bearer your_access_token_here
```

### 📋 Managing Tasks

1. **Create a Todo**
```json
POST /api/todos
{
    "title": "Task name",
    "description": "Task details",
    "dueDate": "2024-03-20T00:00:00.000Z",
    "priority": "high",        // Options: low, medium, high
    "category": "work",
    "tags": ["important", "deadline"]
}
```

2. **Get Todos with Filters**
```http
GET /api/todos?page=1&limit=10&priority=high&search=deadline
```

3. **Update a Todo**
```json
PUT /api/todos/:id
{
    "title": "Updated title",
    "completed": true
}
```

4. **Delete a Todo**
```http
DELETE /api/todos/:id
```

### ⚡ Advanced Features

**Bulk Operations**
```json
POST /api/todos/bulk
{
    "operation": "complete",    // Options: complete, delete
    "todoIds": ["id1", "id2"]
}
```

**Get Statistics**
```http
GET /api/todos/stats/overview
```

## 🔌 API Endpoints

### 👤 Users
- `POST /api/users/register` - Create account
- `POST /api/users/login` - Get access token

### 📝 Todos
- `POST /api/todos` - Create todo
- `GET /api/todos` - List todos (supports filtering & pagination)
- `GET /api/todos/:id` - Get specific todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/bulk` - Bulk actions
- `GET /api/todos/stats/overview` - Get task statistics

## 📌 Important Notes
- Server runs on `http://localhost:3000` by default
- All requests require header: `Content-Type: application/json`
- Protected routes require valid JWT token in Authorization header
- Responses are paginated (default: 10 items per page)
- Search functionality works across titles, descriptions, and tags
- Due dates must be in ISO format

---
If you managed to read up to this point, I'm grateful I didn't bore you out. Kindly consider starring the repo and feel free to share, clone, adapt and improved upon in your own projects. Arigato! 😉
