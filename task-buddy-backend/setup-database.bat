@echo off
echo ========================================
echo Task Buddy - MongoDB Database Setup
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.runCommand('ping')" --quiet > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MongoDB!
    echo Please ensure MongoDB is running on localhost:27017
    echo.
    echo To start MongoDB:
    echo 1. Open Command Prompt as Administrator
    echo 2. Run: net start MongoDB
    echo    OR
    echo 3. Start MongoDB service from Services.msc
    echo.
    pause
    exit /b 1
)

echo ✓ MongoDB connection successful!
echo.

echo Setting up Task Buddy database...
echo Running MongoDB setup script...
echo.

REM Run the MongoDB setup script
mongosh taskbuddy mongodb-setup.js

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✓ Database setup completed successfully!
    echo ========================================
    echo.
    echo Database: taskbuddy
    echo Collections created:
    echo   - tasks (with sample data)
    echo   - notifications (with sample data)
    echo.
    echo Indexes created for optimal performance
    echo Sample data inserted for testing
    echo.
    echo You can now start the Spring Boot application!
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Database setup failed!
    echo ========================================
    echo.
    echo Please check the error messages above
    echo and ensure MongoDB is properly installed
    echo.
)

pause