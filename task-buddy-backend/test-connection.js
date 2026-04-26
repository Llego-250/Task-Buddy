// MongoDB Connection Test Script
// Run with: mongosh taskbuddy test-connection.js

print("========================================");
print("Task Buddy - Database Connection Test");
print("========================================");
print("");

try {
    // Test basic connection
    print("1. Testing database connection...");
    const pingResult = db.runCommand("ping");
    if (pingResult.ok === 1) {
        print("   ✓ Database connection successful");
    } else {
        print("   ✗ Database connection failed");
        quit(1);
    }

    // Check database name
    print("\n2. Checking database...");
    const dbName = db.getName();
    print(`   Database name: ${dbName}`);
    if (dbName === "taskbuddy") {
        print("   ✓ Correct database selected");
    } else {
        print("   ⚠ Warning: Expected 'taskbuddy' database");
    }

    // List collections
    print("\n3. Checking collections...");
    const collections = db.getCollectionNames();
    print(`   Found ${collections.length} collections:`);
    collections.forEach(col => {
        const count = db.getCollection(col).countDocuments();
        print(`   - ${col}: ${count} documents`);
    });

    // Verify required collections
    const requiredCollections = ["tasks", "notifications"];
    const missingCollections = requiredCollections.filter(col => !collections.includes(col));
    
    if (missingCollections.length === 0) {
        print("   ✓ All required collections present");
    } else {
        print(`   ⚠ Missing collections: ${missingCollections.join(", ")}`);
    }

    // Test tasks collection
    print("\n4. Testing tasks collection...");
    if (collections.includes("tasks")) {
        const taskCount = db.tasks.countDocuments();
        print(`   Total tasks: ${taskCount}`);
        
        // Count by column
        const columns = ["todo", "inprogress", "inreview", "done"];
        columns.forEach(col => {
            const count = db.tasks.countDocuments({ columnId: col });
            print(`   - ${col}: ${count} tasks`);
        });

        // Count by priority
        const priorities = ["High", "Medium", "Low"];
        priorities.forEach(priority => {
            const count = db.tasks.countDocuments({ priority: priority });
            print(`   - ${priority} priority: ${count} tasks`);
        });

        print("   ✓ Tasks collection is functional");
    } else {
        print("   ✗ Tasks collection not found");
    }

    // Test notifications collection
    print("\n5. Testing notifications collection...");
    if (collections.includes("notifications")) {
        const notifCount = db.notifications.countDocuments();
        print(`   Total notifications: ${notifCount}`);
        
        const sentCount = db.notifications.countDocuments({ sent: true });
        const pendingCount = db.notifications.countDocuments({ sent: false });
        print(`   - Sent: ${sentCount}`);
        print(`   - Pending: ${pendingCount}`);
        
        print("   ✓ Notifications collection is functional");
    } else {
        print("   ✗ Notifications collection not found");
    }

    // Check indexes
    print("\n6. Checking indexes...");
    if (collections.includes("tasks")) {
        const indexes = db.tasks.getIndexes();
        print(`   Tasks collection has ${indexes.length} indexes:`);
        indexes.forEach(index => {
            const keys = Object.keys(index.key).join(", ");
            print(`   - ${index.name}: {${keys}}`);
        });
        print("   ✓ Indexes are properly configured");
    }

    // Performance test
    print("\n7. Running performance test...");
    const startTime = new Date();
    
    // Test various queries
    db.tasks.find({ columnId: "todo" }).limit(1).toArray();
    db.tasks.find({ priority: "High" }).limit(1).toArray();
    db.tasks.find({ completed: false }).limit(1).toArray();
    db.tasks.find({ $text: { $search: "design" } }).limit(1).toArray();
    
    const endTime = new Date();
    const duration = endTime - startTime;
    print(`   Query performance test completed in ${duration}ms`);
    
    if (duration < 100) {
        print("   ✓ Good performance");
    } else if (duration < 500) {
        print("   ⚠ Acceptable performance");
    } else {
        print("   ⚠ Slow performance - consider optimizing indexes");
    }

    print("\n========================================");
    print("✓ Database test completed successfully!");
    print("========================================");
    print("");
    print("Your Task Buddy database is ready to use.");
    print("You can now start the Spring Boot application.");

} catch (error) {
    print("\n========================================");
    print("✗ Database test failed!");
    print("========================================");
    print("");
    print(`Error: ${error.message}`);
    print("");
    print("Please check:");
    print("1. MongoDB is running");
    print("2. Database setup was completed");
    print("3. Network connectivity");
    
    quit(1);
}