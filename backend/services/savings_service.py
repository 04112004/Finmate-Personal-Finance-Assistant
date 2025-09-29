from backend.models.finance_models import SavingsGoal, InvestmentRisk
from backend.models.database_models import SavingsGoal as DBSavingsGoal, User
from typing import List
from datetime import date, datetime
from sqlalchemy.orm import Session
import uuid

class SavingsService:
    """Service for savings goals management"""
    
    def __init__(self):
        pass
    
    def create_savings_goal(self, goal: SavingsGoal, user_id: int, db: Session) -> DBSavingsGoal:
        """Create a new savings goal"""
        db_goal = DBSavingsGoal(
            name=goal.name,
            target_amount=goal.target_amount,
            current_amount=goal.current_amount,
            target_date=goal.target_date,
            priority=goal.priority,
            user_id=user_id
        )
        db.add(db_goal)
        db.commit()
        db.refresh(db_goal)
        return db_goal
    
    def get_savings_goals(self, user_id: int, db: Session) -> List[DBSavingsGoal]:
        """Get all savings goals for a user"""
        return db.query(DBSavingsGoal).filter(DBSavingsGoal.user_id == user_id).all()
    
    def update_savings_goal(self, goal_id: int, amount: float, user_id: int, db: Session) -> DBSavingsGoal:
        """Update the current amount for a savings goal"""
        goal = db.query(DBSavingsGoal).filter(
            DBSavingsGoal.id == goal_id,
            DBSavingsGoal.user_id == user_id
        ).first()
        
        if goal:
            goal.current_amount = amount
            db.commit()
            db.refresh(goal)
            return goal
        raise ValueError("Savings goal not found")
    
    def delete_savings_goal(self, goal_id: int, user_id: int, db: Session) -> bool:
        """Delete a savings goal"""
        goal = db.query(DBSavingsGoal).filter(
            DBSavingsGoal.id == goal_id,
            DBSavingsGoal.user_id == user_id
        ).first()
        
        if goal:
            db.delete(goal)
            db.commit()
            return True
        return False
    
    def calculate_monthly_savings_needed(self, goal: SavingsGoal) -> float:
        """Calculate how much needs to be saved monthly to reach the goal"""
        months_remaining = self._months_until_date(goal.target_date)
        if months_remaining <= 0:
            return 0
        
        remaining_amount = goal.target_amount - goal.current_amount
        if remaining_amount <= 0:
            return 0
        
        return remaining_amount / months_remaining
    
    def get_savings_progress(self) -> dict:
        """Get overall savings progress"""
        total_target = sum(goal.target_amount for goal in self.savings_goals)
        total_current = sum(goal.current_amount for goal in self.savings_goals)
        
        if total_target == 0:
            return {"progress_percentage": 0, "total_target": 0, "total_current": 0}
        
        progress_percentage = (total_current / total_target) * 100
        
        return {
            "progress_percentage": round(progress_percentage, 1),
            "total_target": total_target,
            "total_current": total_current,
            "remaining_amount": total_target - total_current,
            "goals_count": len(self.savings_goals)
        }
    
    def get_priority_goals(self) -> List[SavingsGoal]:
        """Get goals sorted by priority"""
        return sorted(self.savings_goals, key=lambda x: x.priority, reverse=True)
    
    def _months_until_date(self, target_date: date) -> int:
        """Calculate months until target date"""
        today = date.today()
        if target_date <= today:
            return 0
        
        years = target_date.year - today.year
        months = target_date.month - today.month
        return years * 12 + months

# Global instance
savings_service = SavingsService()
