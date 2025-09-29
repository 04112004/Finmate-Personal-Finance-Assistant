@echo off
echo Starting FinSupport Mobile App...
echo.
echo Backend API: http://localhost:8000
echo Mobile App: http://localhost:3001
echo.
echo Press Ctrl+C to stop the application
echo.

streamlit run frontend/mobile_app.py --server.port 3001 --server.headless true
