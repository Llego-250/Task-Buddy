// MongoDB Setup for VS Code Extension
// Connection: mongodb://localhost:27017/
// Database: taskbuddy

// Switch to taskbuddy database
use('taskbuddy');

// Drop existing collections for clean setup
db.tasks.drop();
db.notifications.drop();

print("Setting up Task Buddy database...");

// Create Tasks Collection with sample data
db.tasks.insertMany([
  {
    _id: "674a1b2c3d4e5f6789012345",
    title: "Design System Implementation",
    description: "Create a comprehensive design system with reusable components and guidelines",
    priority: "High",
    category: "Design",
    columnId: "todo",
    dueDate: "2024-01-15",
    date: "12/15  9:30 AM",
    createdAt: new Date(),
    completed: false,
    estimatedHours: 16.0,
    actualSeconds: 0,
    assigneeName: "Sarah Johnson",
    assigneeAvatar: "https://i.pravatar.cc/32?img=1",
    channelName: "Figma",
    channelIcon: "figma",
    memberAvatars: ["https://i.pravatar.cc/24?img=2", "https://i.pravatar.cc/24?img=3"],
    extraMembers: 2,
    image: null,
    dependencies: [],
    subtasks: [
      { title: "Create color palette", completed: false, hours: 4.0 },
      { title: "Design typography system", completed: false, hours: 6.0 },
      { title: "Build component library", completed: false, hours: 6.0 }
    ],
    recurring: { enabled: false, frequency: null, interval: 0, endDate: null }
  },
  {
    _id: "674a1b2c3d4e5f6789012346",
    title: "API Integration",
    description: "Integrate frontend with backend REST API endpoints",
    priority: "High",
    category: "Development",
    columnId: "inprogress",
    dueDate: "2024-01-12",
    date: "12/14  2:15 PM",
    createdAt: new Date(),
    completed: false,
    estimatedHours: 12.0,
    actualSeconds: 14400,
    assigneeName: "Mike Chen",
    assigneeAvatar: "https://i.pravatar.cc/32?img=4",
    channelName: "GitHub",
    channelIcon: "github",
    memberAvatars: ["https://i.pravatar.cc/24?img=5"],
    extraMembers: 0,
    image: null,
    dependencies: [],
    subtasks: [
      { title: "Setup API client", completed: true, hours: 2.0 },
      { title: "Implement CRUD operations", completed: true, hours: 4.0 },
      { title: "Add error handling", completed: false, hours: 3.0 },
      { title: "Write unit tests", completed: false, hours: 3.0 }
    ],
    recurring: { enabled: false, frequency: null, interval: 0, endDate: null }
  },
  {
    _id: "674a1b2c3d4e5f6789012347",
    title: "User Authentication System",
    description: "Implement secure user authentication with JWT tokens",
    priority: "Medium",
    category: "Development",
    columnId: "inreview",
    dueDate: "2024-01-20",
    date: "12/12  11:45 AM",
    createdAt: new Date(),
    completed: false,
    estimatedHours: 20.0,
    actualSeconds: 28800,
    assigneeName: "Alex Rodriguez",
    assigneeAvatar: "https://i.pravatar.cc/32?img=6",
    channelName: "Slack",
    channelIcon: "slack",
    memberAvatars: ["https://i.pravatar.cc/24?img=7", "https://i.pravatar.cc/24?img=8"],
    extraMembers: 1,
    image: null,
    dependencies: [],
    subtasks: [
      { title: "Setup JWT authentication", completed: true, hours: 6.0 },
      { title: "Implement password hashing", completed: true, hours: 3.0 },
      { title: "Create user registration", completed: false, hours: 5.0 },
      { title: "Add role-based access", completed: false, hours: 6.0 }
    ],
    recurring: { enabled: false, frequency: null, interval: 0, endDate: null }
  },
  {
    _id: "674a1b2c3d4e5f6789012348",
    title: "Database Schema Design",
    description: "Design MongoDB collections with proper indexing",
    priority: "High",
    category: "Development",
    columnId: "done",
    dueDate: "2024-01-08",
    date: "12/10  4:20 PM",
    createdAt: new Date(),
    completed: true,
    estimatedHours: 8.0,
    actualSeconds: 25200,
    assigneeName: "Emma Wilson",
    assigneeAvatar: "https://i.pravatar.cc/32?img=9",
    channelName: "MongoDB",
    channelIcon: "mongodb",
    memberAvatars: ["https://i.pravatar.cc/24?img=10"],
    extraMembers: 0,
    image: null,
    dependencies: [],
    subtasks: [
      { title: "Design task collection schema", completed: true, hours: 3.0 },
      { title: "Create validation rules", completed: true, hours: 2.0 },
      { title: "Setup indexes", completed: true, hours: 2.0 },
      { title: "Test performance", completed: true, hours: 1.0 }
    ],
    recurring: { enabled: false, frequency: null, interval: 0, endDate: null }
  },
  {
    _id: "674a1b2c3d4e5f6789012349",
    title: "Mobile Responsive Design",
    description: "Ensure application works on all device sizes",
    priority: "Medium",
    category: "Design",
    columnId: "todo",
    dueDate: "2024-01-25",
    date: "12/13  1:10 PM",
    createdAt: new Date(),
    completed: false,
    estimatedHours: 14.0,
    actualSeconds: 0,
    assigneeName: "Lisa Park",
    assigneeAvatar: "https://i.pravatar.cc/32?img=11",
    channelName: "Discord",
    channelIcon: "discord",
    memberAvatars: ["https://i.pravatar.cc/24?img=12", "https://i.pravatar.cc/24?img=13"],
    extraMembers: 3,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=160&fit=crop",
    dependencies: ["674a1b2c3d4e5f6789012345"],
    subtasks: [
      { title: "Mobile breakpoint design", completed: false, hours: 5.0 },
      { title: "Tablet optimization", completed: false, hours: 4.0 },
      { title: "Touch interaction design", completed: false, hours: 3.0 },
      { title: "Cross-browser testing", completed: false, hours: 2.0 }
    ],
    recurring: { enabled: false, frequency: null, interval: 0, endDate: null }
  },
  {
    _id: "674a1b2c3d4e5f678901234a",
    title: "Performance Optimization",
    description: "Optimize app performance with code splitting and lazy loading",
    priority: "Low",
    category: "Development",
    columnId: "todo",
    dueDate: "2024-02-01",
    date: "12/15  10:05 AM",
    createdAt: new Date(),
    completed: false,
    estimatedHours: 18.0,
    actualSeconds: 0,
    assigneeName: "David Kim",
    assigneeAvatar: "https://i.pravatar.cc/32?img=14",
    channelName: "GitHub",
    channelIcon: "github",
    memberAvatars: ["https://i.pravatar.cc/24?img=15"],
    extraMembers: 0,
    image: null,
    dependencies: ["674a1b2c3d4e5f6789012346"],
    subtasks: [
      { title: "Implement code splitting", completed: false, hours: 6.0 },
      { title: "Add lazy loading", completed: false, hours: 4.0 },
      { title: "Optimize API calls", completed: false, hours: 5.0 },
      { title: "Performance monitoring", completed: false, hours: 3.0 }
    ],
    recurring: { enabled: true, frequency: "WEEKLY", interval: 1, endDate: new Date("2024-03-01") }
  }
]);

// Create Notifications Collection
db.notifications.insertMany([
  {
    _id: "674a1b2c3d4e5f678901234b",
    taskId: "674a1b2c3d4e5f6789012345",
    type: "REMINDER",
    message: "Design System Implementation is due in 2 days",
    scheduledTime: new Date(Date.now() + 172800000),
    sent: false,
    createdAt: new Date()
  },
  {
    _id: "674a1b2c3d4e5f678901234c",
    taskId: "674a1b2c3d4e5f6789012346",
    type: "DEADLINE",
    message: "API Integration deadline is approaching",
    scheduledTime: new Date(Date.now() + 86400000),
    sent: false,
    createdAt: new Date()
  },
  {
    _id: "674a1b2c3d4e5f678901234d",
    taskId: "674a1b2c3d4e5f6789012348",
    type: "OVERDUE",
    message: "Database Schema Design was completed on time",
    scheduledTime: new Date(Date.now() - 86400000),
    sent: true,
    createdAt: new Date()
  }
]);

// Create indexes for better performance
db.tasks.createIndex({ "columnId": 1 });
db.tasks.createIndex({ "priority": 1 });
db.tasks.createIndex({ "category": 1 });
db.tasks.createIndex({ "completed": 1 });
db.tasks.createIndex({ "createdAt": -1 });
db.tasks.createIndex({ "assigneeName": 1 });
db.tasks.createIndex({ "title": "text", "description": "text" });
db.tasks.createIndex({ "columnId": 1, "priority": 1 });
db.tasks.createIndex({ "completed": 1, "createdAt": -1 });

db.notifications.createIndex({ "taskId": 1 });
db.notifications.createIndex({ "scheduledTime": 1 });
db.notifications.createIndex({ "sent": 1 });
db.notifications.createIndex({ "type": 1 });

print("✓ Database setup completed successfully!");
print("✓ Created 6 sample tasks");
print("✓ Created 3 sample notifications");
print("✓ Created performance indexes");
print("");
print("Database: taskbuddy");
print("Connection: mongodb://localhost:27017/");
print("");
print("You can now start your Spring Boot application!");