from backend.models.finance_models import UserProfile, SavingsGoal, InvestmentRisk
from typing import Dict, List, Optional
import json
import math
from datetime import date, datetime, timedelta

class AISmartService:
    """Advanced AI service for personalized financial advice and smart features"""
    
    def __init__(self):
        self.financial_terms = self._load_financial_terms()
    
    def _load_financial_terms(self) -> Dict[str, str]:
        """Load financial terms from JSON file"""
        try:
            with open('data/financial_terms.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def get_personalized_advice(self, user_profile: UserProfile, 
                               spending_habits: Dict[str, float],
                               current_savings: float) -> Dict[str, any]:
        """Generate personalized financial advice based on user profile and habits"""
        
        advice = {
            "personalized_recommendations": [],
            "risk_assessment": self._assess_financial_risk(user_profile, spending_habits),
            "priority_actions": [],
            "long_term_strategy": ""
        }
        
        # Age-based advice
        if user_profile.age < 30:
            advice["personalized_recommendations"].append({
                "category": "Early Career",
                "advice": "Focus on building an emergency fund and starting retirement savings early. Time is your biggest advantage for compound growth.",
                "priority": "high"
            })
        elif user_profile.age < 50:
            advice["personalized_recommendations"].append({
                "category": "Mid Career",
                "advice": "Maximize retirement contributions and consider diversifying your investment portfolio.",
                "priority": "high"
            })
        else:
            advice["personalized_recommendations"].append({
                "category": "Pre-Retirement",
                "advice": "Focus on capital preservation and consider more conservative investments as you approach retirement.",
                "priority": "high"
            })
        
        # Income-based advice
        if user_profile.income < 50000:
            advice["personalized_recommendations"].append({
                "category": "Budget Optimization",
                "advice": "Focus on the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Every dollar saved now has significant future value.",
                "priority": "medium"
            })
        elif user_profile.income < 100000:
            advice["personalized_recommendations"].append({
                "category": "Wealth Building",
                "advice": "Consider maxing out employer 401k matching and building a diversified investment portfolio.",
                "priority": "medium"
            })
        else:
            advice["personalized_recommendations"].append({
                "category": "Advanced Planning",
                "advice": "Consider tax-advantaged accounts, estate planning, and advanced investment strategies.",
                "priority": "low"
            })
        
        # Spending habits analysis
        total_spending = sum(spending_habits.values())
        if total_spending > 0:
            savings_rate = (user_profile.income / 12 - total_spending) / (user_profile.income / 12)
            
            if savings_rate < 0.1:
                advice["priority_actions"].append("Increase savings rate to at least 10% of income")
            elif savings_rate < 0.2:
                advice["priority_actions"].append("Great job! Consider increasing to 20% for optimal wealth building")
            else:
                advice["priority_actions"].append("Excellent savings rate! Focus on optimizing investment returns")
        
        # Generate long-term strategy
        advice["long_term_strategy"] = self._generate_long_term_strategy(user_profile, current_savings)
        
        return advice
    
    def simulate_scenario(self, scenario_type: str, parameters: Dict[str, any]) -> Dict[str, any]:
        """Simulate financial scenarios like 'What if I save 20% of salary?'"""
        
        if scenario_type == "savings_rate":
            return self._simulate_savings_rate_scenario(parameters)
        elif scenario_type == "investment_return":
            return self._simulate_investment_scenario(parameters)
        elif scenario_type == "retirement":
            return self._simulate_retirement_scenario(parameters)
        else:
            return {"error": "Unknown scenario type"}
    
    def _simulate_savings_rate_scenario(self, params: Dict[str, any]) -> Dict[str, any]:
        """Simulate what happens with different savings rates"""
        current_income = params.get("annual_income", 60000)
        current_savings = params.get("current_savings", 0)
        new_savings_rate = params.get("savings_rate", 0.20)
        years = params.get("years", 10)
        return_rate = params.get("return_rate", 0.07)
        
        monthly_income = current_income / 12
        monthly_savings = monthly_income * new_savings_rate
        
        # Calculate future value
        monthly_return = return_rate / 12
        months = years * 12
        
        # Future value of current savings
        fv_current = current_savings * (1 + return_rate) ** years
        
        # Future value of monthly contributions
        if monthly_return > 0:
            fv_contributions = monthly_savings * (((1 + monthly_return) ** months - 1) / monthly_return)
        else:
            fv_contributions = monthly_savings * months
        
        total_future_value = fv_current + fv_contributions
        
        return {
            "scenario": f"Save {new_savings_rate*100:.1f}% of income",
            "current_savings": current_savings,
            "monthly_savings": monthly_savings,
            "total_contributions": monthly_savings * months,
            "future_value": round(total_future_value, 2),
            "growth_amount": round(total_future_value - current_savings - (monthly_savings * months), 2),
            "years": years,
            "return_rate": return_rate
        }
    
    def _simulate_investment_scenario(self, params: Dict[str, any]) -> Dict[str, any]:
        """Simulate different investment return scenarios"""
        initial_amount = params.get("initial_amount", 10000)
        monthly_contribution = params.get("monthly_contribution", 500)
        years = params.get("years", 10)
        return_rates = params.get("return_rates", [0.05, 0.07, 0.10])
        
        scenarios = []
        for rate in return_rates:
            monthly_return = rate / 12
            months = years * 12
            
            # Future value calculation
            fv_initial = initial_amount * (1 + rate) ** years
            if monthly_return > 0:
                fv_contributions = monthly_contribution * (((1 + monthly_return) ** months - 1) / monthly_return)
            else:
                fv_contributions = monthly_contribution * months
            
            total_value = fv_initial + fv_contributions
            
            scenarios.append({
                "return_rate": rate,
                "future_value": round(total_value, 2),
                "total_contributions": initial_amount + (monthly_contribution * months),
                "growth": round(total_value - initial_amount - (monthly_contribution * months), 2)
            })
        
        return {
            "scenario": "Investment Return Comparison",
            "initial_amount": initial_amount,
            "monthly_contribution": monthly_contribution,
            "years": years,
            "scenarios": scenarios
        }
    
    def _simulate_retirement_scenario(self, params: Dict[str, any]) -> Dict[str, any]:
        """Simulate retirement savings scenarios"""
        current_age = params.get("current_age", 30)
        retirement_age = params.get("retirement_age", 65)
        current_savings = params.get("current_savings", 0)
        monthly_contribution = params.get("monthly_contribution", 500)
        return_rate = params.get("return_rate", 0.07)
        
        years_to_retirement = retirement_age - current_age
        months_to_retirement = years_to_retirement * 12
        
        # Calculate retirement savings
        monthly_return = return_rate / 12
        
        # Future value of current savings
        fv_current = current_savings * (1 + return_rate) ** years_to_retirement
        
        # Future value of monthly contributions
        if monthly_return > 0:
            fv_contributions = monthly_contribution * (((1 + monthly_return) ** months_to_retirement - 1) / monthly_return)
        else:
            fv_contributions = monthly_contribution * months_to_retirement
        
        total_retirement_savings = fv_current + fv_contributions
        
        # Calculate monthly retirement income (4% rule)
        monthly_retirement_income = total_retirement_savings * 0.04 / 12
        
        return {
            "scenario": "Retirement Planning",
            "current_age": current_age,
            "retirement_age": retirement_age,
            "years_to_retirement": years_to_retirement,
            "total_retirement_savings": round(total_retirement_savings, 2),
            "monthly_retirement_income": round(monthly_retirement_income, 2),
            "annual_retirement_income": round(monthly_retirement_income * 12, 2),
            "return_rate": return_rate
        }
    
    def explain_financial_term(self, term: str) -> Dict[str, str]:
        """Explain a financial term using the terms database"""
        term_lower = term.lower().replace(" ", "_").replace("-", "_")
        
        if term_lower in self.financial_terms:
            return {
                "term": term,
                "definition": self.financial_terms[term_lower],
                "found": True
            }
        else:
            # Try to find similar terms
            similar_terms = [t for t in self.financial_terms.keys() if term_lower in t or t in term_lower]
            return {
                "term": term,
                "definition": f"Term '{term}' not found in database.",
                "found": False,
                "similar_terms": similar_terms[:5] if similar_terms else []
            }
    
    def predict_goal_achievement(self, goal: SavingsGoal, 
                                monthly_contribution: float,
                                expected_return: float = 0.05) -> Dict[str, any]:
        """Predict how long it will take to achieve a savings goal"""
        
        if monthly_contribution <= 0:
            return {
                "achievable": False,
                "message": "Monthly contribution must be greater than 0"
            }
        
        # Calculate months needed using compound interest formula
        remaining_amount = goal.target_amount - goal.current_amount
        
        if remaining_amount <= 0:
            return {
                "achievable": True,
                "months_to_goal": 0,
                "years_to_goal": 0,
                "message": "Goal already achieved!"
            }
        
        monthly_return = expected_return / 12
        
        if monthly_return > 0:
            # Use compound interest formula to solve for time
            # FV = PV(1+r)^n + PMT[((1+r)^n - 1)/r]
            # Solving for n (months)
            try:
                # This is a simplified calculation - in practice, you'd use numerical methods
                months_needed = math.ceil(remaining_amount / monthly_contribution)
            except:
                months_needed = remaining_amount / monthly_contribution
        else:
            months_needed = remaining_amount / monthly_contribution
        
        years_needed = months_needed / 12
        
        # Check if goal is achievable within reasonable time
        achievable = years_needed <= 50  # Reasonable upper limit
        
        return {
            "achievable": achievable,
            "months_to_goal": round(months_needed, 1),
            "years_to_goal": round(years_needed, 1),
            "monthly_contribution": monthly_contribution,
            "expected_return": expected_return,
            "message": f"Goal achievable in {round(years_needed, 1)} years" if achievable else "Goal may take too long to achieve"
        }
    
    def _assess_financial_risk(self, user_profile: UserProfile, spending_habits: Dict[str, float]) -> Dict[str, any]:
        """Assess user's financial risk level"""
        risk_factors = []
        risk_score = 0
        
        # Age factor
        if user_profile.age < 30:
            risk_score += 1  # Lower risk for younger people
        elif user_profile.age > 60:
            risk_score += 3  # Higher risk for older people
        
        # Income stability
        if user_profile.income < 30000:
            risk_score += 2
        elif user_profile.income > 100000:
            risk_score -= 1
        
        # Spending habits
        total_spending = sum(spending_habits.values())
        if total_spending > user_profile.income / 12:
            risk_score += 3
            risk_factors.append("Spending exceeds income")
        
        # Emergency fund assessment (simplified)
        if total_spending > 0:
            months_of_expenses = (user_profile.income / 12) / (total_spending / 12) if total_spending > 0 else 0
            if months_of_expenses < 3:
                risk_score += 2
                risk_factors.append("Insufficient emergency fund")
        
        if risk_score <= 2:
            risk_level = "Low"
        elif risk_score <= 4:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "recommendations": self._get_risk_recommendations(risk_level)
        }
    
    def _get_risk_recommendations(self, risk_level: str) -> List[str]:
        """Get recommendations based on risk level"""
        if risk_level == "Low":
            return [
                "Continue current financial practices",
                "Consider increasing investment allocation",
                "Focus on long-term wealth building"
            ]
        elif risk_level == "Medium":
            return [
                "Build emergency fund to 3-6 months expenses",
                "Review and optimize spending",
                "Consider professional financial advice"
            ]
        else:
            return [
                "Immediately reduce spending",
                "Build emergency fund as priority",
                "Consider debt consolidation",
                "Seek professional financial counseling"
            ]
    
    def _generate_long_term_strategy(self, user_profile: UserProfile, current_savings: float) -> str:
        """Generate a personalized long-term financial strategy"""
        age = user_profile.age
        income = user_profile.income
        
        if age < 30:
            return f"Focus on building wealth through consistent investing. With your income of ${income:,.0f}, aim to save 20% annually and invest in growth-oriented assets. Time is your biggest advantage."
        elif age < 50:
            return f"Balance growth and stability. With your current income of ${income:,.0f}, maximize retirement contributions and diversify your portfolio. Consider tax-advantaged accounts."
        else:
            return f"Prioritize capital preservation and income generation. With your income of ${income:,.0f}, focus on conservative investments and ensure you have adequate retirement savings."

# Global instance
ai_smart_service = AISmartService()
