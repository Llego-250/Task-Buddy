// MongoDB Database Setup Script for Task Buddy
// Run this script in MongoDB shell or MongoDB Compass

// Switch to taskbuddy database
use taskbuddy;

// Drop existing collections if they exist (for clean setup)
db.tasks.drop();
db.subtasks.drop();
db.notifications.drop();

// Create Tasks Collection with validation schema
db.createCollection("tasks", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "columnId", "priority"],
      properties: {
        _id: { bsonType: "string" },
        title: { bsonType: "string", minLength: 1, maxLength: 200 },
        description: { bsonType: ["string", "null"], maxLength: 1000 },
        priority: { enum: ["High", "Medium", "Low"] },
        category: { bsonType: ["string", "null"] },
        columnId: { enum: ["todo", "inprogress", "inreview", "done"] },
        dueDate: { bsonType: ["string", "null"] },
        date: { bsonType: ["string", "null"] },
        createdAt: { bsonType: "date" },
        completed: { bsonType: "bool" },
        estimatedHours: { bsonType: ["double", "int"] },
        actualSeconds: { bsonType: ["long", "int"] },
        assigneeName: { bsonType: ["string", "null"] },
        assigneeAvatar: { bsonType: ["string", "null"] },
        channelName: { bsonType: ["string", "null"] },
        channelIcon: { bsonType: ["string", "null"] },
        memberAvatars: { bsonType: "array", items: { bsonType: "string" } },
        extraMembers: { bsonType: ["int", "null"] },
        image: { bsonType: ["string", "null"] },
        dependencies: { bsonType: "array", items: { bsonType: "string" } },
        subtasks: { bsonType: "array" },
        recurring: { bsonType: "object" }
      }
    }
  }
});

// Create Notifications Collection
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["taskId", "type", "scheduledTime"],
      properties: {
        _id: { bsonType: "string" },
        taskId: { bsonType: "string" },
        type: { enum: ["REMINDER", "DEADLINE", "OVERDUE"] },
        message: { bsonType: "string" },
        scheduledTime: { bsonType: "date" },
        sent: { bsonType: "bool" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes for better performance
print("Creating indexes...");

// Tasks collection indexes
db.tasks.createIndex({ "columnId": 1 });
db.tasks.createIndex({ "priority": 1 });
db.tasks.createIndex({ "category": 1 });
db.tasks.createIndex({ "completed": 1 });
db.tasks.createIndex({ "createdAt": -1 });
db.tasks.createIndex({ "assigneeName": 1 });
db.tasks.createIndex({ "title": "text", "description": "text" }); // Text search
db.tasks.createIndex({ "columnId": 1, "priority": 1 }); // Compound index
db.tasks.createIndex({ "completed": 1, "createdAt": -1 }); // Compound index

// Notifications collection indexes
db.notifications.createIndex({ "taskId": 1 });
db.notifications.createIndex({ "scheduledTime": 1 });
db.notifications.createIndex({ "sent": 1 });
db.notifications.createIndex({ "type": 1 });

print("Indexes created successfully!");

// Insert sample data
print("Inserting sample data...");

// Sample tasks data
db.tasks.insertMany([
  {
    _id: "task_1",
    title: "Design System Implementation",
    description: "Create a comprehensive design system with reusable components, color schemes, and typography guidelines for the entire application.",
    priority: "High",
    category: "Design",
    columnId: "todo",
    dueDate: "2024-01-15",
    date: "12/10  9:30 AM",
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
      {
        title: "Create color palette",
        completed: false,
        hours: 4.0
      },
      {
        title: "Design typography system",
        completed: false,
        hours: 6.0
      },
      {
        title: "Build component library",
        completed: false,
        hours: 6.0
      }
    ],
    recurring: {
      enabled: false,
      frequency: null,
      interval: 0,
      endDate: null
    }
  },
  {
    _id: "task_2",
    title: "API Integration",
    description: "Integrate frontend application with backend REST API endpoints for task management functionality.",
    priority: "High",
    category: "Development",
    columnId: "inprogress",
    dueDate: "2024-01-12",
    date: "12/08  2:15 PM",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    completed: false,
    estimatedHours: 12.0,
    actualSeconds: 14400, // 4 hours
    assigneeName: "Mike Chen",
    assigneeAvatar: "https://i.pravatar.cc/32?img=4",
    channelName: "GitHub",
    channelIcon: "github",
    memberAvatars: ["https://i.pravatar.cc/24?img=5"],
    extraMembers: 0,
    image: null,
    dependencies: [],
    subtasks: [
      {
        title: "Setup API client",
        completed: true,
        hours: 2.0
      },
      {
        title: "Implement CRUD operations",
        completed: true,
        hours: 4.0
      },
      {
        title: "Add error handling",
        completed: false,
        hours: 3.0
      },
      {
        title: "Write unit tests",
        completed: false,
        hours: 3.0
      }
    ],
    recurring: {
      enabled: false,
      frequency: null,
      interval: 0,
      endDate: null
    }
  },
  {
    _id: "task_3",
    title: "User Authentication System",
    description: "Implement secure user authentication with JWT tokens, password hashing, and role-based access control.",
    priority: "Medium",
    category: "Development",
    columnId: "inreview",
    dueDate: "2024-01-20",
    date: "12/05  11:45 AM",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    completed: false,
    estimatedHours: 20.0,
    actualSeconds: 28800, // 8 hours
    assigneeName: "Alex Rodriguez",
    assigneeAvatar: "https://i.pravatar.cc/32?img=6",
    channelName: "Slack",
    channelIcon: "slack",
    memberAvatars: ["https://i.pravatar.cc/24?img=7", "https://i.pravatar.cc/24?img=8"],
    extraMembers: 1,
    image: null,
    dependencies: [],
    subtasks: [
      {
        title: "Setup JWT authentication",
        completed: true,
        hours: 6.0
      },
      {
        title: "Implement password hashing",
        completed: true,
        hours: 3.0
      },
      {
        title: "Create user registration",
        completed: false,
        hours: 5.0
      },
      {
        title: "Add role-based access",
        completed: false,
        hours: 6.0
      }
    ],
    recurring: {
      enabled: false,
      frequency: null,
      interval: 0,
      endDate: null
    }
  },
  {
    _id: "task_4",
    title: "Database Schema Design",
    description: "Design and implement MongoDB collections with proper indexing and validation schemas for optimal performance.",
    priority: "High",
    category: "Development",
    columnId: "done",
    dueDate: "2024-01-08",
    date: "12/01  4:20 PM",
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
    completed: true,
    estimatedHours: 8.0,
    actualSeconds: 25200, // 7 hours
    assigneeName: "Emma Wilson",
    assigneeAvatar: "https://i.pravatar.cc/32?img=9",
    channelName: "MongoDB",
    channelIcon: "mongodb",
    memberAvatars: ["https://i.pravatar.cc/24?img=10"],
    extraMembers: 0,
    image: null,
    dependencies: [],
    subtasks: [
      {
        title: "Design task collection schema",
        completed: true,
        hours: 3.0
      },
      {
        title: "Create validation rules",
        completed: true,
        hours: 2.0
      },
      {
        title: "Setup indexes",
        completed: true,
        hours: 2.0
      },
      {
        title: "Test performance",
        completed: true,
        hours: 1.0
      }
    ],
    recurring: {
      enabled: false,
      frequency: null,
      interval: 0,
      endDate: null
    }
  },
  {
    _id: "task_5",
    title: "Mobile Responsive Design",
    description: "Ensure the application works seamlessly across all device sizes with responsive design principles.",
    priority: "Medium",
    category: "Design",
    columnId: "todo",
    dueDate: "2024-01-25",
    date: "12/09  1:10 PM",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
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
    dependencies: ["task_1"],
    subtasks: [
      {
        title: "Mobile breakpoint design",
        completed: false,
        hours: 5.0
      },
      {
        title: "Tablet optimization",
        completed: false,
        hours: 4.0
      },
      {
        title: "Touch interaction design",
        completed: false,
        hours: 3.0
      },
      {
        title: "Cross-browser testing",
        completed: false,
        hours: 2.0
      }
    ],
    recurring: {
      enabled: false,
      frequency: null,
      interval: 0,
      endDate: null
    }
  },
  {
    _id: "task_6",
    title: "Performance Optimization",
    description: "Optimize application performance through code splitting, lazy loading, and efficient data fetching strategies.",
    priority: "Low",
    category: "Development",
    columnId: "todo",
    dueDate: "2024-02-01",
    date: "12/11  10:05 AM",
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
    dependencies: ["task_2"],
    subtasks: [
      {
        title: "Implement code splitting",
        completed: false,
        hours: 6.0
      },
      {
        title: "Add lazy loading",
        completed: false,
        hours: 4.0
      },
      {
        title: "Optimize API calls",
        completed: false,
        hours: 5.0
      },
      {
        title: "Performance monitoring",
        completed: false,
        hours: 3.0
      }
    ],
    recurring: {
      enabled: true,
      frequency: "WEEKLY",
      interval: 1,
      endDate: new Date("2024-03-01")
    }
  }
]);

// Insert sample notifications
db.notifications.insertMany([
  {
    _id: "notif_1",
    taskId: "task_1",
    type: "REMINDER",
    message: "Design System Implementation is due in 2 days",
    scheduledTime: new Date(Date.now() + 172800000), // 2 days from now
    sent: false,
    createdAt: new Date()
  },
  {
    _id: "notif_2",
    taskId: "task_2",
    type: "DEADLINE",
    message: "API Integration deadline is approaching",
    scheduledTime: new Date(Date.now() + 86400000), // 1 day from now
    sent: false,
    createdAt: new Date()
  },
  {
    _id: "notif_3",
    taskId: "task_4",
    type: "OVERDUE",
    message: "Database Schema Design was completed on time",
    scheduledTime: new Date(Date.now() - 86400000), // 1 day ago
    sent: true,
    createdAt: new Date(Date.now() - 604800000)
  }
]);

print("Sample data inserted successfully!");

// Create additional useful indexes for analytics
db.tasks.createIndex({ "createdAt": 1, "completed": 1 });
db.tasks.createIndex({ "priority": 1, "columnId": 1 });
db.tasks.createIndex({ "category": 1, "completed": 1 });

// Verify collections and data
print("\n=== Database Setup Complete ===");
print("Collections created:");
db.getCollectionNames().forEach(function(collection) {
  print("- " + collection + ": " + db.getCollection(collection).countDocuments() + " documents");
});

print("\nIndexes created:");
db.tasks.getIndexes().forEach(function(index) {
  print("- tasks." + JSON.stringify(index.key));
});

print("\nDatabase 'taskbuddy' is ready for use!");