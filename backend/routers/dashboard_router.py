from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
import random

router = APIRouter()

class DashboardMetrics(BaseModel):
    net_worth: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float
    credit_score: int
    goals_achieved: int
    total_goals: int

class FinancialTrend(BaseModel):
    date: str
    net_worth: float
    savings: float
    investments: float

class RecentTransaction(BaseModel):
    date: str
    description: str
    amount: float
    category: str
    type: str  # 'income' or 'expense'

class FinancialAlert(BaseModel):
    type: str  # 'success', 'warning', 'info'
    message: str
    priority: str  # 'high', 'medium', 'low'

@router.get("/metrics")
def get_dashboard_metrics():
    """
    Get key financial metrics for the dashboard
    """
    try:
        # In a real application, this would fetch from a database
        # For now, we'll return sample data with some randomization
        base_net_worth = 45000
        variation = random.uniform(0.9, 1.1)
        net_worth = base_net_worth * variation
        
        base_income = 6000
        income_variation = random.uniform(0.95, 1.05)
        monthly_income = base_income * income_variation
        
        # Expenses are typically 60-80% of income
        expense_ratio = random.uniform(0.65, 0.75)
        monthly_expenses = monthly_income * expense_ratio
        
        savings_rate = ((monthly_income - monthly_expenses) / monthly_income) * 100
        
        return DashboardMetrics(
            net_worth=round(net_worth, 2),
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            savings_rate=round(savings_rate, 1),
            credit_score=random.randint(720, 820),
            goals_achieved=random.randint(2, 4),
            total_goals=5
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/trends")
def get_financial_trends(months: int = 12):
    """
    Get financial trends over time
    """
    try:
        trends = []
        base_date = datetime.now() - timedelta(days=months * 30)
        base_net_worth = 30000
        base_savings = 5000
        base_investments = 15000
        
        for i in range(months):
            current_date = base_date + timedelta(days=i * 30)
            
            # Add some realistic growth with variation
            growth_factor = 1 + (i * 0.02) + random.uniform(-0.01, 0.01)
            net_worth = base_net_worth * growth_factor + random.uniform(-1000, 1000)
            savings = base_savings * growth_factor + random.uniform(-500, 500)
            investments = base_investments * growth_factor + random.uniform(-2000, 2000)
            
            trends.append(FinancialTrend(
                date=current_date.strftime("%Y-%m-%d"),
                net_worth=round(net_worth, 2),
                savings=round(savings, 2),
                investments=round(investments, 2)
            ))
        
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/recent-transactions")
def get_recent_transactions(limit: int = 10):
    """
    Get recent financial transactions
    """
    try:
        transactions = []
        base_date = datetime.now()
        
        # Sample transaction data
        transaction_templates = [
            {"description": "Salary Deposit", "amount": 6000, "category": "Income", "type": "income"},
            {"description": "Grocery Store", "amount": -85.50, "category": "Food", "type": "expense"},
            {"description": "Gas Station", "amount": -45.20, "category": "Transportation", "type": "expense"},
            {"description": "Netflix Subscription", "amount": -15.99, "category": "Entertainment", "type": "expense"},
            {"description": "Investment Transfer", "amount": 500, "category": "Investment", "type": "income"},
            {"description": "Rent Payment", "amount": -1200, "category": "Housing", "type": "expense"},
            {"description": "Electric Bill", "amount": -120, "category": "Utilities", "type": "expense"},
            {"description": "Coffee Shop", "amount": -4.50, "category": "Food", "type": "expense"},
            {"description": "Uber Ride", "amount": -12.75, "category": "Transportation", "type": "expense"},
            {"description": "Freelance Work", "amount": 300, "category": "Income", "type": "income"},
            {"description": "Gym Membership", "amount": -49.99, "category": "Health", "type": "expense"},
            {"description": "Book Purchase", "amount": -25.99, "category": "Education", "type": "expense"}
        ]
        
        for i in range(min(limit, len(transaction_templates))):
            template = transaction_templates[i]
            transaction_date = base_date - timedelta(days=i)
            
            transactions.append(RecentTransaction(
                date=transaction_date.strftime("%Y-%m-%d"),
                description=template["description"],
                amount=template["amount"],
                category=template["category"],
                type=template["type"]
            ))
        
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/alerts")
def get_financial_alerts():
    """
    Get financial alerts and insights
    """
    try:
        alerts = [
            FinancialAlert(
                type="success",
                message="✅ Emergency fund target reached!",
                priority="high"
            ),
            FinancialAlert(
                type="warning",
                message="⚠️ Credit card balance higher than usual",
                priority="medium"
            ),
            FinancialAlert(
                type="info",
                message="💡 Consider increasing 401k contribution",
                priority="low"
            ),
            FinancialAlert(
                type="success",
                message="🎯 Savings goal 75% complete",
                priority="medium"
            ),
            FinancialAlert(
                type="info",
                message="📈 Investment portfolio up 3.2% this month",
                priority="low"
            ),
            FinancialAlert(
                type="warning",
                message="⚠️ Monthly spending 15% over budget",
                priority="high"
            ),
            FinancialAlert(
                type="info",
                message="💳 Credit score improved by 15 points",
                priority="low"
            )
        ]
        
        # Randomly select 5 alerts
        selected_alerts = random.sample(alerts, min(5, len(alerts)))
        
        return {"alerts": selected_alerts}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/spending-breakdown")
def get_spending_breakdown():
    """
    Get spending breakdown by category
    """
    try:
        spending_data = {
            "Housing": random.uniform(1500, 2000),
            "Food": random.uniform(400, 700),
            "Transportation": random.uniform(300, 500),
            "Entertainment": random.uniform(200, 400),
            "Utilities": random.uniform(200, 300),
            "Healthcare": random.uniform(100, 300),
            "Other": random.uniform(100, 200)
        }
        
        return {"spending_breakdown": spending_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health-score")
def get_financial_health_score():
    """
    Calculate and return financial health score
    """
    try:
        # Simple financial health calculation
        # In a real app, this would be more sophisticated
        base_score = 70
        variation = random.uniform(-10, 20)
        health_score = max(0, min(100, base_score + variation))
        
        return {
            "score": round(health_score, 1),
            "level": "Good" if health_score >= 70 else "Fair" if health_score >= 50 else "Poor",
            "recommendations": [
                "Maintain current savings rate",
                "Consider increasing emergency fund",
                "Review investment allocation"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
