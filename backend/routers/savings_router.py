from fastapi import APIRouter, HTTPException, Depends
from backend.models.finance_models import SavingsGoal
from backend.services.savings_service import savings_service
from backend.database import get_db
from backend.auth import get_current_active_user
from backend.models.database_models import User
from sqlalchemy.orm import Session
from typing import List
from datetime import date

router = APIRouter()

@router.post("/goals")
def create_savings_goal(
    goal: SavingsGoal,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new savings goal
    """
    try:
        created_goal = savings_service.create_savings_goal(goal, current_user.id, db)
        return {
            "id": created_goal.id,
            "name": created_goal.name,
            "target_amount": created_goal.target_amount,
            "current_amount": created_goal.current_amount,
            "target_date": created_goal.target_date.isoformat(),
            "priority": created_goal.priority,
            "created_at": created_goal.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/goals")
def get_savings_goals(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all savings goals
    """
    goals = savings_service.get_savings_goals(current_user.id, db)
    return [
        {
            "id": goal.id,
            "name": goal.name,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "target_date": goal.target_date.isoformat(),
            "priority": goal.priority,
            "created_at": goal.created_at.isoformat()
        }
        for goal in goals
    ]

@router.put("/goals/{goal_id}")
def update_savings_goal(
    goal_id: int,
    current_amount: float,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update the current amount for a savings goal
    """
    try:
        updated_goal = savings_service.update_savings_goal(goal_id, current_amount, current_user.id, db)
        return {
            "id": updated_goal.id,
            "name": updated_goal.name,
            "target_amount": updated_goal.target_amount,
            "current_amount": updated_goal.current_amount,
            "target_date": updated_goal.target_date.isoformat(),
            "priority": updated_goal.priority,
            "created_at": updated_goal.created_at.isoformat()
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/goals/{goal_id}")
def delete_savings_goal(
    goal_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a savings goal
    """
    success = savings_service.delete_savings_goal(goal_id, current_user.id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return {"message": "Savings goal deleted successfully"}

@router.get("/goals/{goal_id}/monthly-target")
def get_monthly_savings_target(goal_id: str):
    """
    Calculate how much needs to be saved monthly to reach a goal
    """
    try:
        goals = savings_service.get_savings_goals()
        goal = next((g for g in goals if g.id == goal_id), None)
        if not goal:
            raise ValueError("Savings goal not found")
        
        monthly_target = savings_service.calculate_monthly_savings_needed(goal)
        return {
            "goal_name": goal.name,
            "monthly_target": round(monthly_target, 2),
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "remaining_amount": goal.target_amount - goal.current_amount
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/progress")
def get_savings_progress():
    """
    Get overall savings progress across all goals
    """
    return savings_service.get_savings_progress()

@router.get("/goals/priority")
def get_priority_goals():
    """
    Get savings goals sorted by priority
    """
    return savings_service.get_priority_goals()
