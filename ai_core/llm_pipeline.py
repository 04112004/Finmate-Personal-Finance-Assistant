from ai_core.prompts.financial_prompts import FINANCIAL_PROMPT_TEMPLATE

def generate_ai_response(user_input: str) -> str:
    """
    Process user input and generate AI financial advice.
    """
    # Create a more intelligent response based on the user's question
    user_input_lower = user_input.lower()
    
    # Budget-related questions
    if any(word in user_input_lower for word in ['budget', 'budgeting', 'spending', 'expenses']):
        return """Here's how to create an effective budget:

1. **Track Your Income**: List all your monthly income sources
2. **List Your Expenses**: Categorize into fixed (rent, utilities) and variable (food, entertainment)
3. **Use the 50/30/20 Rule**: 
   - 50% for needs (housing, food, transportation)
   - 30% for wants (entertainment, dining out)
   - 20% for savings and debt repayment
4. **Use Budgeting Apps**: Consider apps like Mint, YNAB, or PocketGuard
5. **Review Monthly**: Adjust your budget based on actual spending

Start by tracking your expenses for one month to understand your spending patterns."""

    # Retirement questions
    elif any(word in user_input_lower for word in ['retirement', 'retire', 'pension', '401k', 'ira']):
        return """Here's a comprehensive retirement savings strategy:

**Start Early**: The power of compound interest means starting in your 20s is ideal
**Contribution Rates**:
- Aim for 15-20% of your income
- Take advantage of employer 401(k) matching
- Consider Roth IRA for tax-free growth

**Investment Strategy**:
- Young investors: 80-90% stocks, 10-20% bonds
- Age 40+: Gradually shift to more conservative mix
- Use low-cost index funds for diversification

**Key Accounts**:
- 401(k) with employer matching (free money!)
- Roth IRA for tax-free withdrawals
- Traditional IRA for tax deductions

**Rule of Thumb**: Save 10x your salary by age 67 for comfortable retirement."""

    # Savings questions
    elif any(word in user_input_lower for word in ['save', 'saving', 'savings', 'emergency']):
        return """Here's your complete savings strategy:

**Emergency Fund First**:
- Save 3-6 months of expenses
- Keep in high-yield savings account
- This is your financial safety net

**Savings Hierarchy**:
1. Emergency fund (3-6 months expenses)
2. High-interest debt payoff
3. Retirement savings (15-20% of income)
4. Other goals (house, vacation, etc.)

**Savings Tips**:
- Automate transfers to savings
- Use the "pay yourself first" principle
- Consider high-yield savings accounts (2-4% APY)
- Separate accounts for different goals

**Goal Setting**: Make savings goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)."""

    # Investment questions
    elif any(word in user_input_lower for word in ['invest', 'investment', 'stocks', 'bonds', 'portfolio']):
        return """Here's how to start investing wisely:

**Before You Invest**:
- Build emergency fund first
- Pay off high-interest debt (>7%)
- Understand your risk tolerance

**Investment Options**:
- **Index Funds**: Low-cost, diversified (S&P 500, Total Stock Market)
- **ETFs**: Similar to index funds, tradeable like stocks
- **Target-Date Funds**: Automatically adjust risk as you age
- **Individual Stocks**: Higher risk, requires research

**Diversification Strategy**:
- Don't put all eggs in one basket
- Mix of stocks, bonds, and international investments
- Consider your age: (100 - your age) = % in stocks

**Start Simple**: Begin with a low-cost S&P 500 index fund or target-date fund."""

    # Debt questions
    elif any(word in user_input_lower for word in ['debt', 'credit', 'loan', 'pay off']):
        return """Here's your debt payoff strategy:

**Debt Payoff Methods**:
1. **Debt Snowball**: Pay minimums, then focus on smallest debt first
2. **Debt Avalanche**: Pay minimums, then focus on highest interest rate first

**Priority Order**:
1. High-interest credit cards (15-25% APR)
2. Personal loans (5-15% APR)
3. Student loans (3-7% APR)
4. Mortgage (3-5% APR)

**Debt Reduction Tips**:
- Stop using credit cards while paying off
- Consider balance transfer cards (0% intro APR)
- Negotiate with creditors for lower rates
- Consider debt consolidation loans

**Rule**: If debt interest > investment returns, pay debt first."""

    # General financial advice
    else:
        return f"""I'd be happy to help with your financial question: "{user_input}"

Here are some general financial principles to consider:

**Financial Foundation**:
- Build an emergency fund (3-6 months expenses)
- Pay off high-interest debt first
- Save 15-20% of income for retirement
- Invest in low-cost index funds for long-term growth

**Key Financial Habits**:
- Track your spending to understand where money goes
- Automate savings and bill payments
- Review and adjust your financial plan regularly
- Continue learning about personal finance

Could you be more specific about what financial topic you'd like help with? I can provide detailed advice on budgeting, investing, debt management, retirement planning, or other financial topics."""
