from fastapi import APIRouter, HTTPException, Depends
from backend.models.finance_models import Expense, ExpenseSummary, BudgetCategory
from backend.services.expense_service import expense_service
from backend.database import get_db
from backend.auth import get_current_active_user
from backend.models.database_models import User
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

router = APIRouter()

@router.post("/expenses")
def add_expense(
    expense: Expense,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add a new expense
    """
    try:
        created_expense = expense_service.add_expense(expense, current_user.id, db)
        return {
            "id": created_expense.id,
            "description": created_expense.description,
            "amount": created_expense.amount,
            "category": created_expense.category,
            "date": created_expense.date.isoformat(),
            "created_at": created_expense.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/expenses")
def get_expenses(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get expenses within a date range
    """
    expenses = expense_service.get_expenses(current_user.id, start_date, end_date, db)
    return [
        {
            "id": expense.id,
            "description": expense.description,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date.isoformat(),
            "created_at": expense.created_at.isoformat()
        }
        for expense in expenses
    ]

@router.get("/expenses/summary")
def get_expense_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get expense summary and analysis
    """
    return expense_service.get_expense_summary(current_user.id, start_date, end_date, db)

@router.get("/expenses/breakdown")
def get_category_breakdown(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed expense breakdown by category
    """
    return expense_service.get_category_breakdown(current_user.id, db)

@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete an expense
    """
    success = expense_service.delete_expense(expense_id, current_user.id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}

@router.get("/categories")
def get_expense_categories():
    """
    Get available expense categories
    """
    return {
        "categories": [
            {"value": category.value, "name": category.value.replace("_", " ").title()}
            for category in BudgetCategory
        ]
    }
