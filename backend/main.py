from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import ai_chat, budget_router, savings_router, expense_router, investment_router, ai_smart_router, dashboard_router, mobile_support_router, auth_router
from backend.database import create_tables

app = FastAPI(title="Financial Coach AI", version="1.0.0")

# Create database tables
create_tables()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Coach"])
app.include_router(budget_router.router, prefix="/api/budget", tags=["Budget Planning"])
app.include_router(savings_router.router, prefix="/api/savings", tags=["Savings Goals"])
app.include_router(expense_router.router, prefix="/api/expenses", tags=["Expense Tracking"])
app.include_router(investment_router.router, prefix="/api/investments", tags=["Investment Advice"])
app.include_router(ai_smart_router.router, prefix="/api/smart", tags=["AI Smart Features"])
app.include_router(dashboard_router.router, prefix="/api/dashboard", tags=["Financial Dashboard"])
app.include_router(mobile_support_router.router, prefix="/api/mobile", tags=["Mobile Support Platform"])

@app.get("/")
def root():
    return {
        "message": "Welcome to Financial Coach AI",
        "version": "1.0.0",
        "features": [
            "AI Financial Coaching",
            "Budget Planning",
            "Savings Goals Tracking",
            "Expense Tracking",
            "Investment Advice",
            "Personalized AI Advice",
            "Scenario Simulation",
            "Financial Terminology",
            "Goal Achievement Predictor"
        ]
    }
