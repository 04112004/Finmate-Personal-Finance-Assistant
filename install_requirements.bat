@echo off
echo Installing FinMate Requirements...
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Installing Node.js dependencies...
cd react-frontend
npm install

echo.
echo Installation complete!
echo.
echo To start the system, run: start_complete_system.bat
echo Or manually start:
echo   Backend: cd backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
echo   Frontend: cd react-frontend && npm start
echo.
pause
