# Task Buddy - Full Stack Task Management Application

A comprehensive task management application built with Vue.js frontend and Spring Boot backend, featuring kanban boards, real-time notifications, and advanced task tracking capabilities.

## 🚀 Features

### ✅ Implemented Core Features
- **Kanban Board**: Drag-and-drop task management across columns (To Do, In Progress, In Review, Done)
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Priority Management**: High/Medium/Low priority levels with visual indicators
- **Category Organization**: Organize tasks by Design, Development, Marketing, Research, etc.
- **Search & Filter**: Find tasks by title, description, priority, and category
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Real-time Updates**: Backend API integration with MongoDB persistence

### 🔄 Task Management Features
- **Task Details**: Rich descriptions, due dates, and assignee information
- **Subtasks**: Break down complex tasks into manageable subtasks
- **Progress Tracking**: Visual progress bars based on completed subtasks
- **Time Tracking**: Estimated vs actual hours tracking
- **Task Dependencies**: Link related tasks together
- **Recurring Tasks**: Set up daily, weekly, or monthly recurring tasks

### 📊 Advanced Features
- **Analytics Dashboard**: Productivity metrics and completion statistics
- **Notification System**: Custom reminders and deadline alerts
- **Team Collaboration**: Assign tasks to team members with avatars
- **Multiple Views**: Kanban board, list view, and table view
- **Bulk Operations**: Select and manage multiple tasks at once

## 🛠 Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Spring Boot 3** - Java application framework
- **Spring Data MongoDB** - Database integration
- **Spring Web** - REST API development
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation

### Database
- **MongoDB** - NoSQL document database
- **Optimized Indexes** - For fast query performance
- **Schema Validation** - Ensure data integrity

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Java** (JDK 17 or higher)
- **MongoDB** (v5.0 or higher)
- **Maven** (v3.6 or higher)

## 🚀 Quick Start

### 1. Database Setup

**Option A: Automated Setup (Recommended)**
```bash
cd task-buddy-backend

# Windows PowerShell
.\setup-database.ps1

# Windows Command Prompt
setup-database.bat
```

**Option B: Manual Setup**
```bash
# Start MongoDB service
net start MongoDB

# Run setup script
mongosh taskbuddy mongodb-setup.js
```

### 2. Backend Setup

```bash
cd task-buddy-backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
Task-Buddy/
├── src/                          # Vue.js Frontend
│   ├── components/               # Reusable Vue components
│   ├── views/                    # Page components
│   ├── stores/                   # Pinia state management
│   ├── services/                 # API services
│   └── router/                   # Vue Router configuration
├── task-buddy-backend/           # Spring Boot Backend
│   ├── src/main/java/com/taskbuddy/
│   │   ├── controller/           # REST API controllers
│   │   ├── service/              # Business logic
│   │   ├── model/                # Data models
│   │   ├── dto/                  # Data transfer objects
│   │   ├── repository/           # Database repositories
│   │   └── config/               # Configuration classes
│   ├── mongodb-setup.js          # Database initialization
│   ├── setup-database.ps1       # Automated DB setup (PowerShell)
│   ├── setup-database.bat       # Automated DB setup (Batch)
│   └── DATABASE_SETUP.md         # Database documentation
└── README.md                     # This file
```

## 🗄 Database Schema

### Tasks Collection
```javascript
{
  _id: "string",
  title: "string",
  description: "string",
  priority: "High|Medium|Low",
  category: "string",
  columnId: "todo|inprogress|inreview|done",
  dueDate: "string",
  assigneeName: "string",
  subtasks: [{ title, completed, hours }],
  // ... additional fields
}
```

### Notifications Collection
```javascript
{
  _id: "string",
  taskId: "string",
  type: "REMINDER|DEADLINE|OVERDUE",
  message: "string",
  scheduledTime: "Date",
  sent: "boolean"
}
```

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/kanban` - Get tasks grouped by column
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}/move` - Move task between columns
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/search?q={query}` - Search tasks
- `GET /api/tasks/filter` - Filter tasks by criteria

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/{id}/mark-sent` - Mark as sent

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/productivity` - Get productivity stats

## 🧪 Testing

### Test Database Connection
```bash
cd task-buddy-backend
mongosh taskbuddy test-connection.js
```

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd task-buddy-backend
mvn test
```

## 🚀 Deployment

### Frontend (Production Build)
```bash
npm run build
```

### Backend (JAR Package)
```bash
cd task-buddy-backend
mvn clean package
java -jar target/task-buddy-backend-1.0.0.jar
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: WebSocket integration for live updates
- **Email Notifications**: SMTP integration for email reminders
- **File Attachments**: Upload and attach files to tasks
- **Time Tracking**: Built-in timer for work sessions
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Mobile App**: React Native or Flutter mobile application
- **Advanced Analytics**: Detailed productivity reports and insights
- **Team Management**: User roles, permissions, and team workspaces
- **API Rate Limiting**: Implement rate limiting for API security
- **Caching**: Redis integration for improved performance

### Technical Improvements
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Logging**: Comprehensive application logging
- **Monitoring**: Health checks and metrics
- **Docker**: Containerization for easy deployment
- **CI/CD**: Automated testing and deployment pipelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [DATABASE_SETUP.md](task-buddy-backend/DATABASE_SETUP.md) for database-related issues
2. Ensure all prerequisites are installed and services are running
3. Check the console logs for detailed error messages
4. Create an issue in the repository with detailed information

## 📊 Project Status

- ✅ **Core Features**: Completed
- ✅ **Database Integration**: Completed
- ✅ **API Development**: Completed
- ✅ **Frontend UI**: Completed
- 🔄 **Authentication**: In Progress
- 📋 **Advanced Analytics**: Planned
- 📋 **Mobile App**: Planned

---

**Built with ❤️ for efficient task management**
