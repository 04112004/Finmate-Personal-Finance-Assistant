# 💰 FinMate - Personal Finance Assistant

A comprehensive full-stack personal finance management platform with AI-powered financial intelligence.

## 🚀 Features

- **Smart Financial Dashboard** - Real-time metrics and interactive charts
- **AI-Powered Financial Coach** - Personalized advice and recommendations
- **Advanced Budget Planning** - Dynamic budget creation and tracking
- **Intelligent Savings Goals** - Goal prediction and achievement forecasting
- **Expense Tracking System** - Automated categorization and analysis
- **Investment Advisory** - Risk assessment and portfolio recommendations
- **Smart Financial Analysis** - Scenario simulation and predictions
- **Secure Authentication** - JWT-based user management

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **JWT** - Authentication
- **Pydantic** - Data validation
- **SQLite** - Database

### Frontend
- **React.js** - User interface
- **Styled Components** - CSS-in-JS styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Router** - Navigation

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Navigate to project directory
cd FinMate

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup
```bash
# Navigate to React frontend
cd react-frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🎯 Usage

1. **Start the backend server** (http://localhost:8000)
2. **Start the frontend application** (http://localhost:3000)
3. **Register a new account** or use test credentials:
   - Username: `testuser`
   - Password: `testpass123`
4. **Explore all features** - Dashboard, AI Coach, Budget Planning, etc.

## 📊 API Endpoints

- **Authentication:** `/api/auth/login`, `/api/auth/register`
- **Dashboard:** `/api/dashboard/metrics`
- **Savings:** `/api/savings/goals`
- **Expenses:** `/api/expenses/expenses`
- **AI Features:** `/api/smart/*`
- **Investment:** `/api/investments/*`

## 🔧 Development

### Project Structure
```
FinMate/
├── backend/                 # FastAPI backend
│   ├── routers/            # API route handlers
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   └── main.py             # Application entry point
├── react-frontend/         # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
└── requirements.txt        # Python dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational and personal use.

## 👨‍💻 Author

[Your Name] - [Your Email] - [Your LinkedIn]

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React for the powerful frontend library
- All open-source contributors