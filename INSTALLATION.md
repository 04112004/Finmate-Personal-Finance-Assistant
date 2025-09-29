# FinMate - Complete Installation Guide

## 🚀 Quick Start

### Option 1: Use the Batch File (Recommended)
```bash
# Double-click on start_complete_system.bat
# This will start both backend and frontend automatically
```

### Option 2: Manual Installation

## 📋 Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn

## 🔧 Backend Installation

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install Python dependencies
```bash
pip install -r ../requirements.txt
```

### 3. Start the backend server
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 🎨 Frontend Installation

### 1. Navigate to frontend directory
```bash
cd react-frontend
```

### 2. Install Node.js dependencies
```bash
npm install
```

### 3. Start the frontend server
```bash
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

## 🔐 Default Test Credentials

- **Username**: testuser
- **Password**: testpass123

## 📦 Complete Requirements

### Python Dependencies (requirements.txt)
```
# FastAPI and Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database and ORM
sqlalchemy==2.0.23
databases[sqlite]==0.8.0
aiosqlite==0.19.0

# Authentication and Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.1.2

# Data Processing and Visualization
pandas==2.1.3
plotly==5.17.0
numpy==1.25.2

# HTTP and API
requests==2.31.0
httpx==0.25.2

# Development and Testing
pytest==7.4.3
pytest-asyncio==0.21.1

# Optional: Streamlit for admin interface
streamlit==1.28.1
```

### Node.js Dependencies (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.3.0",
    "styled-components": "^5.3.5",
    "framer-motion": "^7.2.1",
    "react-icons": "^4.4.0",
    "react-hot-toast": "^2.4.0",
    "recharts": "^2.5.0",
    "react-plotly.js": "^2.6.0"
  }
}
```

## 🛠️ Troubleshooting

### Backend Issues
- **ModuleNotFoundError**: Run `pip install -r requirements.txt`
- **Database errors**: Check if SQLite file is created in backend directory
- **Port 8000 in use**: Change port in uvicorn command

### Frontend Issues
- **npm start fails**: Run `npm install` first
- **Port 3000 in use**: React will automatically use next available port
- **Build errors**: Check Node.js version (16+ required)

## 📁 Project Structure
```
FinMate/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── auth.py
│   ├── models/
│   ├── routers/
│   └── services/
├── react-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── requirements.txt
├── start_complete_system.bat
└── INSTALLATION.md
```

## ✅ Verification

After installation, you should see:
1. Backend running on http://127.0.0.1:8000
2. Frontend running on http://localhost:3000
3. Debug panels visible on frontend
4. Login with testuser/testpass123 works
5. Redirect to dashboard after login

## 🎯 Features Included

- ✅ User Authentication (JWT)
- ✅ Database Integration (SQLite)
- ✅ Expense Tracking
- ✅ Savings Goals
- ✅ Budget Planning
- ✅ AI Coach
- ✅ Investment Advisor
- ✅ Smart Features
- ✅ Mobile Support
- ✅ Real-time Debug Panels
