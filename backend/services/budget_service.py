from backend.models.finance_models import BudgetPlan, BudgetItem, BudgetCategory
from typing import List

class BudgetService:
    """Service for budget planning and management"""
    
    @staticmethod
    def generate_budget_plan(monthly_income: float, user_preferences: dict = None) -> BudgetPlan:
        """
        Generate a suggested budget plan based on the 50/30/20 rule with customization
        """
        # Default budget allocation (50/30/20 rule)
        default_allocations = {
            BudgetCategory.HOUSING: 0.30,      # 30% for housing
            BudgetCategory.FOOD: 0.15,         # 15% for food
            BudgetCategory.TRANSPORTATION: 0.10, # 10% for transportation
            BudgetCategory.UTILITIES: 0.05,     # 5% for utilities
            BudgetCategory.HEALTHCARE: 0.05,   # 5% for healthcare
            BudgetCategory.ENTERTAINMENT: 0.10, # 10% for entertainment
            BudgetCategory.SAVINGS: 0.20,       # 20% for savings
            BudgetCategory.DEBT: 0.05,          # 5% for debt payments
        }
        
        # Apply user preferences if provided
        if user_preferences:
            for category, percentage in user_preferences.items():
                if category in default_allocations:
                    default_allocations[category] = percentage
        
        # Create budget items
        budget_items = []
        total_allocated = 0
        
        for category, percentage in default_allocations.items():
            amount = monthly_income * percentage
            budget_items.append(BudgetItem(
                category=category,
                amount=round(amount, 2),
                percentage=round(percentage * 100, 1)
            ))
            total_allocated += amount
        
        # Calculate remaining amount
        remaining = monthly_income - total_allocated
        
        return BudgetPlan(
            monthly_income=monthly_income,
            budget_items=budget_items,
            total_budget=round(total_allocated, 2),
            remaining_amount=round(remaining, 2)
        )
    
    @staticmethod
    def analyze_budget_vs_actual(budget_plan: BudgetPlan, actual_expenses: List[dict]) -> dict:
        """
        Analyze how actual expenses compare to budget
        """
        analysis = {
            "overall_status": "on_track",
            "category_analysis": {},
            "recommendations": []
        }
        
        # Calculate actual expenses by category
        actual_by_category = {}
        for expense in actual_expenses:
            category = expense.get("category", "other")
            amount = expense.get("amount", 0)
            actual_by_category[category] = actual_by_category.get(category, 0) + amount
        
        # Compare with budget
        total_overspend = 0
        for item in budget_plan.budget_items:
            category = item.category.value
            budgeted = item.amount
            actual = actual_by_category.get(category, 0)
            
            difference = actual - budgeted
            percentage_used = (actual / budgeted * 100) if budgeted > 0 else 0
            
            analysis["category_analysis"][category] = {
                "budgeted": budgeted,
                "actual": actual,
                "difference": round(difference, 2),
                "percentage_used": round(percentage_used, 1),
                "status": "over" if difference > 0 else "under"
            }
            
            if difference > 0:
                total_overspend += difference
                analysis["recommendations"].append(
                    f"Consider reducing {category} expenses by ${abs(difference):.2f}"
                )
        
        if total_overspend > 0:
            analysis["overall_status"] = "over_budget"
            analysis["total_overspend"] = round(total_overspend, 2)
        elif total_overspend < -budget_plan.remaining_amount:
            analysis["overall_status"] = "under_budget"
            analysis["recommendations"].append("Great job! You're under budget. Consider increasing savings.")
        
        return analysis
