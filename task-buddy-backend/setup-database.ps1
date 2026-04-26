# Task Buddy - MongoDB Database Setup Script
# PowerShell version for better error handling and cross-platform support

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task Buddy - MongoDB Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if MongoDB is running
function Test-MongoConnection {
    try {
        $result = & mongosh --eval "db.runCommand('ping')" --quiet 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Check MongoDB connection
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
if (-not (Test-MongoConnection)) {
    Write-Host "ERROR: Cannot connect to MongoDB!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure MongoDB is running on localhost:27017" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start MongoDB:" -ForegroundColor White
    Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Gray
    Write-Host "2. Run: Start-Service MongoDB" -ForegroundColor Gray
    Write-Host "   OR" -ForegroundColor Gray
    Write-Host "3. Start MongoDB service from Services.msc" -ForegroundColor Gray
    Write-Host "   OR" -ForegroundColor Gray
    Write-Host "4. Run: mongod --dbpath C:\data\db" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ MongoDB connection successful!" -ForegroundColor Green
Write-Host ""

# Check if setup script exists
$setupScript = "mongodb-setup.js"
if (-not (Test-Path $setupScript)) {
    Write-Host "ERROR: Setup script '$setupScript' not found!" -ForegroundColor Red
    Write-Host "Please ensure you're running this from the task-buddy-backend directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Setting up Task Buddy database..." -ForegroundColor Yellow
Write-Host "Running MongoDB setup script..." -ForegroundColor Gray
Write-Host ""

# Run the MongoDB setup script
try {
    & mongosh taskbuddy $setupScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database: taskbuddy" -ForegroundColor White
        Write-Host "Collections created:" -ForegroundColor White
        Write-Host "  - tasks (with sample data)" -ForegroundColor Gray
        Write-Host "  - notifications (with sample data)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Indexes created for optimal performance" -ForegroundColor Gray
        Write-Host "Sample data inserted for testing" -ForegroundColor Gray
        Write-Host ""
        Write-Host "You can now start the Spring Boot application!" -ForegroundColor Cyan
        Write-Host ""
        
        # Show quick stats
        Write-Host "Quick Stats:" -ForegroundColor Yellow
        $taskCount = & mongosh taskbuddy --eval "db.tasks.countDocuments()" --quiet
        $notifCount = & mongosh taskbuddy --eval "db.notifications.countDocuments()" --quiet
        Write-Host "  - Tasks: $taskCount" -ForegroundColor Gray
        Write-Host "  - Notifications: $notifCount" -ForegroundColor Gray
        Write-Host ""
    } else {
        throw "MongoDB setup script failed with exit code $LASTEXITCODE"
    }
}
catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Database setup failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. MongoDB is properly installed and running" -ForegroundColor Gray
    Write-Host "2. You have write permissions to the database" -ForegroundColor Gray
    Write-Host "3. No firewall is blocking the connection" -ForegroundColor Gray
    Write-Host ""
}

Read-Host "Press Enter to exit"