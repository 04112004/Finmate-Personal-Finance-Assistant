from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.models.finance_models import UserProfile
from backend.services.ai_smart_service import ai_smart_service
from typing import Dict, List, Any

router = APIRouter()

class PersonalizedAdviceRequest(BaseModel):
    user_profile: UserProfile
    spending_habits: Dict[str, float]
    current_savings: float

@router.post("/personalized-advice")
def get_personalized_advice(request: PersonalizedAdviceRequest):
    """
    Get personalized financial advice based on user profile and spending habits
    """
    try:
        advice = ai_smart_service.get_personalized_advice(
            request.user_profile, 
            request.spending_habits, 
            request.current_savings
        )
        return advice
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class ScenarioSimulationRequest(BaseModel):
    scenario_type: str
    parameters: Dict[str, Any]

@router.post("/scenario-simulation")
def simulate_financial_scenario(request: ScenarioSimulationRequest):
    """
    Simulate financial scenarios like savings rate changes, investment returns, etc.
    Supported scenarios: 'savings_rate', 'investment_return', 'retirement'
    """
    try:
        result = ai_smart_service.simulate_scenario(request.scenario_type, request.parameters)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/explain-term/{term}")
def explain_financial_term(term: str):
    """
    Get explanation for a financial term
    """
    try:
        explanation = ai_smart_service.explain_financial_term(term)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class GoalPredictionRequest(BaseModel):
    goal_name: str
    target_amount: float
    current_amount: float
    monthly_contribution: float
    expected_return: float = 0.05

@router.post("/goal-prediction")
def predict_goal_achievement(request: GoalPredictionRequest):
    """
    Predict how long it will take to achieve a financial goal
    """
    try:
        from backend.models.finance_models import SavingsGoal
        from datetime import date
        
        # Create a temporary goal object
        goal = SavingsGoal(
            name=request.goal_name,
            target_amount=request.target_amount,
            current_amount=request.current_amount,
            target_date=date.today().replace(year=date.today().year + 10),  # Default date
            priority=1
        )
        
        prediction = ai_smart_service.predict_goal_achievement(goal, request.monthly_contribution, request.expected_return)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/available-scenarios")
def get_available_scenarios():
    """
    Get list of available scenario simulation types
    """
    return {
        "scenarios": [
            {
                "type": "savings_rate",
                "name": "Savings Rate Simulation",
                "description": "Simulate what happens if you change your savings rate",
                "parameters": ["annual_income", "current_savings", "savings_rate", "years", "return_rate"]
            },
            {
                "type": "investment_return",
                "name": "Investment Return Comparison",
                "description": "Compare different investment return scenarios",
                "parameters": ["initial_amount", "monthly_contribution", "years", "return_rates"]
            },
            {
                "type": "retirement",
                "name": "Retirement Planning",
                "description": "Simulate retirement savings scenarios",
                "parameters": ["current_age", "retirement_age", "current_savings", "monthly_contribution", "return_rate"]
            }
        ]
    }

@router.get("/financial-terms")
def get_financial_terms():
    """
    Get all available financial terms
    """
    try:
        terms = ai_smart_service.financial_terms
        return {
            "terms": list(terms.keys()),
            "total_count": len(terms)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class SmartAnalysisRequest(BaseModel):
    user_profile: UserProfile
    spending_data: List[Dict[str, Any]]
    savings_goals: List[Dict[str, Any]]

@router.post("/smart-analysis")
def get_smart_financial_analysis(request: SmartAnalysisRequest):
    """
    Get comprehensive smart analysis combining all AI features
    """
    try:
        # Calculate spending habits
        spending_habits = {}
        for expense in request.spending_data:
            category = expense.get("category", "other")
            amount = expense.get("amount", 0)
            spending_habits[category] = spending_habits.get(category, 0) + amount
        
        # Calculate current savings
        current_savings = sum(goal.get("current_amount", 0) for goal in request.savings_goals)
        
        # Get personalized advice
        advice = ai_smart_service.get_personalized_advice(request.user_profile, spending_habits, current_savings)
        
        # Analyze each savings goal
        from backend.models.finance_models import SavingsGoal
        from datetime import date
        
        goal_analyses = []
        for goal in request.savings_goals:
            goal_name = goal.get("name", "Unknown Goal")
            target_amount = goal.get("target_amount", 0)
            current_amount = goal.get("current_amount", 0)
            
            # Predict goal achievement with different contribution levels
            monthly_contributions = [100, 200, 500, 1000]
            predictions = []
            
            for monthly_contrib in monthly_contributions:
                pred = ai_smart_service.predict_goal_achievement(
                    SavingsGoal(
                        name=goal_name,
                        target_amount=target_amount,
                        current_amount=current_amount,
                        target_date=date.today().replace(year=date.today().year + 10),
                        priority=1
                    ),
                    monthly_contrib
                )
                predictions.append({
                    "monthly_contribution": monthly_contrib,
                    "prediction": pred
                })
            
            goal_analyses.append({
                "goal_name": goal_name,
                "target_amount": target_amount,
                "current_amount": current_amount,
                "predictions": predictions
            })
        
        return {
            "personalized_advice": advice,
            "goal_analyses": goal_analyses,
            "spending_analysis": {
                "total_spending": sum(spending_habits.values()),
                "spending_by_category": spending_habits,
                "savings_rate": (request.user_profile.income / 12 - sum(spending_habits.values())) / (request.user_profile.income / 12) if request.user_profile.income > 0 else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
