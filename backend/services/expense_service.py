from backend.models.finance_models import Expense, ExpenseSummary, BudgetCategory
from backend.models.database_models import Expense as DBExpense, User
from typing import List
from datetime import date, datetime, timedelta
from collections import defaultdict
from sqlalchemy.orm import Session
import uuid

class ExpenseService:
    """Service for expense tracking and analysis"""
    
    def __init__(self):
        pass
    
    def add_expense(self, expense: Expense, user_id: int, db: Session) -> DBExpense:
        """Add a new expense"""
        db_expense = DBExpense(
            description=expense.description,
            amount=expense.amount,
            category=expense.category.value,
            date=expense.date,
            user_id=user_id
        )
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return db_expense
    
    def get_expenses(self, user_id: int, start_date: date = None, end_date: date = None, db: Session = None) -> List[DBExpense]:
        """Get expenses within a date range for a specific user"""
        query = db.query(DBExpense).filter(DBExpense.user_id == user_id)
        
        if start_date:
            query = query.filter(DBExpense.date >= start_date)
        if end_date:
            query = query.filter(DBExpense.date <= end_date)
        
        return query.all()
    
    def get_expense_summary(self, user_id: int, start_date: date = None, end_date: date = None, db: Session = None) -> ExpenseSummary:
        """Get expense summary and analysis"""
        expenses = self.get_expenses(user_id, start_date, end_date, db)
        
        # Calculate total expenses
        total_expenses = sum(expense.amount for expense in expenses)
        
        # Group by category
        expenses_by_category = defaultdict(float)
        for expense in expenses:
            expenses_by_category[expense.category] += expense.amount
        
        # Calculate monthly trend (last 6 months)
        monthly_trend = self._calculate_monthly_trend(user_id, db)
        
        # Get top categories
        top_categories = sorted(
            expenses_by_category.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        return ExpenseSummary(
            total_expenses=round(total_expenses, 2),
            expenses_by_category=dict(expenses_by_category),
            monthly_trend=monthly_trend,
            top_categories=[{"category": cat, "amount": amount} for cat, amount in top_categories]
        )
    
    def get_category_breakdown(self, user_id: int, db: Session) -> dict:
        """Get detailed breakdown by category"""
        expenses = self.get_expenses(user_id, db=db)
        expenses_by_category = defaultdict(list)
        for expense in expenses:
            expenses_by_category[expense.category].append(expense)
        
        breakdown = {}
        for category, expense_list in expenses_by_category.items():
            total_amount = sum(expense.amount for expense in expense_list)
            breakdown[category] = {
                "total_amount": round(total_amount, 2),
                "transaction_count": len(expense_list),
                "average_transaction": round(total_amount / len(expense_list), 2) if expense_list else 0,
                "transactions": [
                    {
                        "description": expense.description,
                        "amount": expense.amount,
                        "date": expense.date.isoformat()
                    }
                    for expense in expense_list
                ]
            }
        
        return breakdown
    
    def _calculate_monthly_trend(self, user_id: int, db: Session) -> List[dict]:
        """Calculate monthly spending trend for the last 6 months"""
        today = date.today()
        trend = []
        
        for i in range(6):
            # Calculate start and end of month
            month_start = date(today.year, today.month - i, 1)
            if today.month - i <= 0:
                month_start = date(today.year - 1, 12 + (today.month - i), 1)
            
            # Calculate end of month
            if month_start.month == 12:
                month_end = date(month_start.year + 1, 1, 1) - timedelta(days=1)
            else:
                month_end = date(month_start.year, month_start.month + 1, 1) - timedelta(days=1)
            
            # Get expenses for this month
            month_expenses = self.get_expenses(user_id, month_start, month_end, db)
            total_amount = sum(expense.amount for expense in month_expenses)
            
            trend.append({
                "month": month_start.strftime("%Y-%m"),
                "amount": round(total_amount, 2),
                "transaction_count": len(month_expenses)
            })
        
        return list(reversed(trend))  # Return in chronological order
    
    def delete_expense(self, expense_id: int, user_id: int, db: Session) -> bool:
        """Delete an expense"""
        expense = db.query(DBExpense).filter(
            DBExpense.id == expense_id,
            DBExpense.user_id == user_id
        ).first()
        
        if expense:
            db.delete(expense)
            db.commit()
            return True
        return False

# Global instance
expense_service = ExpenseService()
