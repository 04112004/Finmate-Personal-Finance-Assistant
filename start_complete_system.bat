@echo off
echo Starting FinMate Complete System...
echo.

echo Installing Python dependencies...
pip install -r requirements.txt
echo.

echo Starting Backend Server...
start "FinMate Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
echo Backend starting on http://127.0.0.1:8000
echo.

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "FinMate Frontend" cmd /k "cd react-frontend && npm start"
echo Frontend starting on http://localhost:3000
echo.

echo.
echo ========================================
echo FinMate System Started Successfully!
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo API Documentation: http://127.0.0.1:8000/docs
echo.
echo Features Available:
echo - User Registration & Login
echo - Expense Tracking with Database
echo - Savings Goals with Database  
echo - AI Financial Coach
echo - Budget Planning
echo - Investment Advice
echo - Smart Financial Analysis
echo.
echo The system now includes:
echo - SQLite Database for data persistence
echo - JWT Authentication
echo - User isolation (each user sees only their data)
echo - Complete CRUD operations
echo - Production-ready architecture
echo.
echo Press any key to exit...
pause > nul
