from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from enum import Enum

class BudgetCategory(str, Enum):
    HOUSING = "housing"
    FOOD = "food"
    TRANSPORTATION = "transportation"
    UTILITIES = "utilities"
    HEALTHCARE = "healthcare"
    ENTERTAINMENT = "entertainment"
    SAVINGS = "savings"
    DEBT = "debt"
    OTHER = "other"

class InvestmentRisk(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class BudgetItem(BaseModel):
    category: BudgetCategory
    amount: float = Field(gt=0, description="Amount in dollars")
    percentage: Optional[float] = Field(None, ge=0, le=100, description="Percentage of income")

class BudgetPlan(BaseModel):
    monthly_income: float = Field(gt=0, description="Monthly income in dollars")
    budget_items: List[BudgetItem]
    total_budget: float
    remaining_amount: float

class SavingsGoal(BaseModel):
    id: Optional[str] = None
    name: str
    target_amount: float = Field(gt=0, description="Target amount in dollars")
    current_amount: float = Field(ge=0, description="Current saved amount")
    target_date: date
    priority: int = Field(ge=1, le=5, description="Priority from 1 (lowest) to 5 (highest)")
    created_at: Optional[datetime] = None

class Expense(BaseModel):
    id: Optional[str] = None
    description: str
    amount: float = Field(gt=0, description="Amount in dollars")
    category: BudgetCategory
    date: date
    created_at: Optional[datetime] = None

class ExpenseSummary(BaseModel):
    total_expenses: float
    expenses_by_category: dict
    monthly_trend: List[dict]
    top_categories: List[dict]

class InvestmentRecommendation(BaseModel):
    risk_level: InvestmentRisk
    asset_allocation: dict
    recommended_investments: List[dict]
    expected_return: float
    risk_description: str

class UserProfile(BaseModel):
    age: int = Field(ge=18, le=100)
    income: float = Field(gt=0)
    risk_tolerance: InvestmentRisk
    investment_goals: List[str]
    time_horizon: int = Field(ge=1, description="Investment time horizon in years")
