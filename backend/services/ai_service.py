def get_ai_response(user_input: str) -> str:
    """
    Calls AI pipeline to get financial advice.
    """
    # Simple AI response based on keywords
    user_input_lower = user_input.lower()
    
    if "budget" in user_input_lower:
        return "I recommend creating a 50/30/20 budget: 50% for needs, 30% for wants, and 20% for savings and debt repayment."
    elif "savings" in user_input_lower:
        return "Start with an emergency fund of 3-6 months of expenses, then focus on retirement savings and other financial goals."
    elif "investment" in user_input_lower:
        return "Consider diversifying your investments across stocks, bonds, and other assets. Start with low-cost index funds."
    elif "debt" in user_input_lower:
        return "Focus on paying off high-interest debt first, then work on building an emergency fund."
    elif "retirement" in user_input_lower:
        return "Aim to save 15-20% of your income for retirement. Take advantage of employer 401(k) matching if available."
    else:
        return "I'm here to help with your financial questions! Feel free to ask about budgeting, saving, investing, or any other financial topics."
