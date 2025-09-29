@echo off
echo Starting FinSupport React Mobile App...
echo.
echo Backend API: http://localhost:8000
echo React Mobile App: http://localhost:3001
echo.
echo Installing dependencies and starting the app...
echo.

cd mobile-react
npm install
set PORT=3001
npm start
