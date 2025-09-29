from backend.models.finance_models import InvestmentRecommendation, InvestmentRisk, UserProfile
from typing import List, Dict

class InvestmentService:
    """Service for investment advice and recommendations"""
    
    # Mock investment data
    INVESTMENT_OPTIONS = {
        InvestmentRisk.LOW: {
            "description": "Conservative approach focusing on capital preservation",
            "asset_allocation": {
                "bonds": 70,
                "stocks": 20,
                "cash": 10
            },
            "investments": [
                {"name": "Government Bonds", "type": "Bond", "risk": "Low", "expected_return": 3.5},
                {"name": "High-Yield Savings", "type": "Cash", "risk": "Very Low", "expected_return": 2.0},
                {"name": "Blue Chip Stocks", "type": "Stock", "risk": "Low", "expected_return": 6.0},
                {"name": "REITs", "type": "Real Estate", "risk": "Low-Medium", "expected_return": 5.5}
            ],
            "expected_return": 4.0
        },
        InvestmentRisk.MEDIUM: {
            "description": "Balanced approach with moderate risk and growth potential",
            "asset_allocation": {
                "stocks": 60,
                "bonds": 30,
                "alternatives": 10
            },
            "investments": [
                {"name": "S&P 500 Index Fund", "type": "Stock", "risk": "Medium", "expected_return": 8.0},
                {"name": "Corporate Bonds", "type": "Bond", "risk": "Low-Medium", "expected_return": 4.5},
                {"name": "International Stocks", "type": "Stock", "risk": "Medium", "expected_return": 7.5},
                {"name": "Commodity ETFs", "type": "Alternative", "risk": "Medium", "expected_return": 6.0}
            ],
            "expected_return": 6.5
        },
        InvestmentRisk.HIGH: {
            "description": "Aggressive approach focusing on long-term growth",
            "asset_allocation": {
                "stocks": 80,
                "alternatives": 15,
                "bonds": 5
            },
            "investments": [
                {"name": "Growth Stocks", "type": "Stock", "risk": "High", "expected_return": 12.0},
                {"name": "Small Cap Stocks", "type": "Stock", "risk": "High", "expected_return": 10.0},
                {"name": "Emerging Markets", "type": "Stock", "risk": "Very High", "expected_return": 9.0},
                {"name": "Cryptocurrency", "type": "Alternative", "risk": "Very High", "expected_return": 15.0}
            ],
            "expected_return": 10.0
        }
    }
    
    @staticmethod
    def get_investment_recommendation(user_profile: UserProfile) -> InvestmentRecommendation:
        """Get personalized investment recommendations based on user profile"""
        risk_level = user_profile.risk_tolerance
        
        # Adjust risk based on age and time horizon
        adjusted_risk = InvestmentService._adjust_risk_for_profile(user_profile)
        
        investment_data = InvestmentService.INVESTMENT_OPTIONS[adjusted_risk]
        
        return InvestmentRecommendation(
            risk_level=adjusted_risk,
            asset_allocation=investment_data["asset_allocation"],
            recommended_investments=investment_data["investments"],
            expected_return=investment_data["expected_return"],
            risk_description=investment_data["description"]
        )
    
    @staticmethod
    def get_risk_assessment(age: int, income: float, time_horizon: int, goals: List[str]) -> InvestmentRisk:
        """Assess risk tolerance based on user characteristics"""
        risk_score = 0
        
        # Age factor (younger = higher risk tolerance)
        if age < 30:
            risk_score += 3
        elif age < 40:
            risk_score += 2
        elif age < 50:
            risk_score += 1
        else:
            risk_score += 0
        
        # Income factor (higher income = higher risk tolerance)
        if income > 100000:
            risk_score += 2
        elif income > 50000:
            risk_score += 1
        
        # Time horizon factor
        if time_horizon > 10:
            risk_score += 2
        elif time_horizon > 5:
            risk_score += 1
        
        # Goals factor
        aggressive_goals = ["retirement", "wealth_building", "early_retirement"]
        if any(goal in aggressive_goals for goal in goals):
            risk_score += 1
        
        # Determine risk level
        if risk_score >= 5:
            return InvestmentRisk.HIGH
        elif risk_score >= 3:
            return InvestmentRisk.MEDIUM
        else:
            return InvestmentRisk.LOW
    
    @staticmethod
    def calculate_retirement_savings(current_age: int, retirement_age: int, 
                                   current_savings: float, monthly_contribution: float,
                                   expected_return: float) -> Dict:
        """Calculate retirement savings projection"""
        years_to_retirement = retirement_age - current_age
        months_to_retirement = years_to_retirement * 12
        
        # Calculate future value with monthly contributions
        monthly_return = expected_return / 12 / 100
        
        # Future value of current savings
        future_value_current = current_savings * (1 + expected_return / 100) ** years_to_retirement
        
        # Future value of monthly contributions (annuity)
        if monthly_return > 0:
            future_value_contributions = monthly_contribution * (
                ((1 + monthly_return) ** months_to_retirement - 1) / monthly_return
            )
        else:
            future_value_contributions = monthly_contribution * months_to_retirement
        
        total_retirement_savings = future_value_current + future_value_contributions
        
        return {
            "current_savings": current_savings,
            "monthly_contribution": monthly_contribution,
            "years_to_retirement": years_to_retirement,
            "expected_return": expected_return,
            "projected_savings": round(total_retirement_savings, 2),
            "total_contributions": round(monthly_contribution * months_to_retirement, 2),
            "growth_amount": round(total_retirement_savings - current_savings - (monthly_contribution * months_to_retirement), 2)
        }
    
    @staticmethod
    def _adjust_risk_for_profile(profile: UserProfile) -> InvestmentRisk:
        """Adjust risk level based on user profile"""
        risk = profile.risk_tolerance
        
        # Age-based adjustment
        if profile.age > 60 and risk == InvestmentRisk.HIGH:
            return InvestmentRisk.MEDIUM
        elif profile.age < 30 and risk == InvestmentRisk.LOW:
            return InvestmentRisk.MEDIUM
        
        # Time horizon adjustment
        if profile.time_horizon < 3 and risk == InvestmentRisk.HIGH:
            return InvestmentRisk.MEDIUM
        
        return risk
