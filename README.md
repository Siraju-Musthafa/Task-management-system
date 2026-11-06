# MERN Stack – Multi-Role Task Management System

A full-stack Task Management System built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application allows teams to create, assign, manage, and track tasks through role-based dashboards, real-time updates, and email notifications.

## Features

### 1. Authentication and Authorization
- User registration and login.
- JWT-based authentication.
- Secure password hashing.
- Role-based access control.
- Protected frontend and backend routes.

### 2. User Roles

**Admin**
- View and manage all users.
- Create, update, and delete tasks.
- Assign tasks to Managers and Users.
- Monitor all tasks and their progress.

**Manager**
- Create and manage tasks.
- Assign tasks to Users.
- Track task progress.
- View tasks assigned to their team.

**User**
- View assigned tasks.
- Update task status.
- Track task priorities and due dates.
- View task details.

### 3. Task Management
- Create, edit, view, and delete tasks.
- Assign tasks to team members.
- Set task priorities:
  - Low
  - Medium
  - High
- Set task due dates.
- Track task statuses:
  - Pending
  - In Progress
  - Completed
- Search and filter tasks.
- Pagination for task listings.

### 4. Kanban Board
- Display tasks in three columns:
  - Pending
  - In Progress
  - Completed
- Drag and drop tasks between columns.
- Automatically update task status after moving a task.

### 5. Real-Time Updates
- Socket.io integration.
- Receive real-time task assignment notifications.
- Receive updates when tasks are modified.
- Synchronize task status changes.

### 6. Email Notifications
- Nodemailer integration.
- Email notifications when tasks are assigned.
- Email notifications when tasks are updated.

### 7. Dashboard
- Role-based dashboards.
- Task progress tracking.
- Task status overview.
- User and task management for administrators.

## Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- Socket.io Client
- @dnd-kit (Drag and Drop)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Socket.io
- Nodemailer
- dotenv
- CORS

## Project Structure

```text
Task Management System/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── task.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── task.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── task.routes.js
│   │
│   ├── utils/
│   │   └── email.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│  
