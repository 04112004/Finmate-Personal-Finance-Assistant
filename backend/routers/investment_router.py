from fastapi import APIRouter, HTTPException
from backend.models.finance_models import InvestmentRecommendation, UserProfile, InvestmentRisk
from backend.services.investment_service import InvestmentService
from typing import List, Dict

router = APIRouter()

@router.post("/recommendations", response_model=InvestmentRecommendation)
def get_investment_recommendation(user_profile: UserProfile):
    """
    Get personalized investment recommendations based on user profile
    """
    try:
        recommendation = InvestmentService.get_investment_recommendation(user_profile)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/risk-assessment")
def assess_risk_tolerance(age: int, income: float, time_horizon: int, goals: List[str]):
    """
    Assess risk tolerance based on user characteristics
    """
    try:
        risk_level = InvestmentService.get_risk_assessment(age, income, time_horizon, goals)
        return {
            "risk_level": risk_level,
            "description": InvestmentService.INVESTMENT_OPTIONS[risk_level]["description"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/retirement-calculator")
def calculate_retirement_savings(
    current_age: int,
    retirement_age: int,
    current_savings: float,
    monthly_contribution: float,
    expected_return: float
):
    """
    Calculate retirement savings projection
    """
    try:
        if current_age >= retirement_age:
            raise ValueError("Retirement age must be greater than current age")
        if expected_return < 0 or expected_return > 20:
            raise ValueError("Expected return must be between 0 and 20 percent")
        
        projection = InvestmentService.calculate_retirement_savings(
            current_age, retirement_age, current_savings, 
            monthly_contribution, expected_return
        )
        return projection
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/risk-levels")
def get_risk_levels():
    """
    Get available risk levels and their descriptions
    """
    return {
        "risk_levels": [
            {
                "level": risk.value,
                "description": InvestmentService.INVESTMENT_OPTIONS[risk]["description"],
                "expected_return": InvestmentService.INVESTMENT_OPTIONS[risk]["expected_return"]
            }
            for risk in InvestmentRisk
        ]
    }

@router.get("/investment-options/{risk_level}")
def get_investment_options(risk_level: InvestmentRisk):
    """
    Get investment options for a specific risk level
    """
    if risk_level not in InvestmentService.INVESTMENT_OPTIONS:
        raise HTTPException(status_code=400, detail="Invalid risk level")
    
    return InvestmentService.INVESTMENT_OPTIONS[risk_level]
