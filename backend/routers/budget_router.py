from fastapi import APIRouter, HTTPException
from backend.models.finance_models import BudgetPlan, BudgetItem, BudgetCategory
from backend.services.budget_service import BudgetService
from typing import List, Dict

router = APIRouter()

@router.post("/generate", response_model=BudgetPlan)
def generate_budget_plan(monthly_income: float, user_preferences: Dict[str, float] = None):
    """
    Generate a personalized budget plan based on income and preferences
    """
    try:
        budget_plan = BudgetService.generate_budget_plan(monthly_income, user_preferences)
        return budget_plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/analyze")
def analyze_budget_performance(budget_plan: BudgetPlan, actual_expenses: List[Dict]):
    """
    Analyze how actual expenses compare to the budget plan
    """
    try:
        analysis = BudgetService.analyze_budget_vs_actual(budget_plan, actual_expenses)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/categories")
def get_budget_categories():
    """
    Get available budget categories
    """
    return {
        "categories": [
            {"value": category.value, "name": category.value.replace("_", " ").title()}
            for category in BudgetCategory
        ]
    }

@router.post("/custom-budget")
def create_custom_budget(monthly_income: float, budget_items: List[BudgetItem]):
    """
    Create a custom budget with specific allocations
    """
    try:
        # Validate that total doesn't exceed income
        total_allocated = sum(item.amount for item in budget_items)
        if total_allocated > monthly_income:
            raise ValueError("Total budget allocation cannot exceed monthly income")
        
        budget_plan = BudgetPlan(
            monthly_income=monthly_income,
            budget_items=budget_items,
            total_budget=total_allocated,
            remaining_amount=monthly_income - total_allocated
        )
        
        return budget_plan
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
