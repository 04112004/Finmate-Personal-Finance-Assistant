import streamlit as st
import requests
import json
from datetime import date, datetime, timedelta
import pandas as pd

# Configure page for mobile-first design
st.set_page_config(
    page_title="FinSupport - Financial Assistance Platform", 
    page_icon="🤝", 
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for mobile app styling
st.markdown("""
<style>
    /* Mobile-first responsive design */
    .main .block-container {
        padding: 1rem;
        max-width: 100%;
    }
    
    /* Hide default Streamlit elements for mobile app feel */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Mobile app container */
    .mobile-container {
        max-width: 400px;
        margin: 0 auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 0;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        overflow: hidden;
    }
    
    /* Header with gradient */
    .app-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem 1.5rem 1rem;
        color: white;
        text-align: center;
        position: relative;
    }
    
    .app-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .app-subtitle {
        font-size: 0.9rem;
        opacity: 0.9;
        margin: 0.5rem 0 0;
    }
    
    /* Dashboard cards */
    .dashboard-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
    }
    
    .balance-card {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        text-align: center;
        margin: 1rem;
        border-radius: 20px;
        padding: 2rem 1.5rem;
        box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
    }
    
    .balance-amount {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .balance-label {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
    }
    
    /* Quick action buttons */
    .quick-action {
        background: white;
        border: none;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        cursor: pointer;
        width: 100%;
        text-align: center;
        font-weight: 600;
    }
    
    .quick-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .primary-action {
        background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
        color: white;
        font-size: 1.1rem;
        padding: 1.2rem;
        border-radius: 16px;
        box-shadow: 0 6px 20px rgba(86, 171, 47, 0.3);
    }
    
    .secondary-action {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        color: white;
        font-size: 1rem;
    }
    
    .emergency-action {
        background: linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%);
        color: white;
        font-size: 1rem;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    /* Transaction list */
    .transaction-item {
        background: white;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        border-left: 4px solid #4facfe;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .transaction-amount {
        font-weight: 700;
        font-size: 1.1rem;
    }
    
    .transaction-positive {
        color: #56ab2f;
    }
    
    .transaction-negative {
        color: #ff6b6b;
    }
    
    /* Bottom navigation */
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 400px;
        background: white;
        border-top: 1px solid #e0e0e0;
        padding: 0.5rem 0;
        display: flex;
        justify-content: space-around;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        text-decoration: none;
        color: #666;
        font-size: 0.8rem;
        transition: color 0.3s ease;
    }
    
    .nav-item.active {
        color: #4facfe;
    }
    
    .nav-icon {
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
    }
    
    /* Status indicators */
    .status-badge {
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-pending {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-approved {
        background: #d4edda;
        color: #155724;
    }
    
    .status-processing {
        background: #cce5ff;
        color: #004085;
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
        .main .block-container {
            padding: 0.5rem;
        }
        
        .mobile-container {
            max-width: 100%;
            border-radius: 0;
        }
    }
</style>
""", unsafe_allow_html=True)

# API base URL
API_BASE = "http://localhost:8000"

# Initialize session state for navigation
if 'current_page' not in st.session_state:
    st.session_state.current_page = 'home'

# Mobile App Container
st.markdown('<div class="mobile-container">', unsafe_allow_html=True)

# App Header
st.markdown("""
<div class="app-header">
    <h1 class="app-title">🤝 FinSupport</h1>
    <p class="app-subtitle">Financial Assistance & Support Platform</p>
</div>
""", unsafe_allow_html=True)

# Main Content based on current page
if st.session_state.current_page == 'home':
    # Dashboard Content
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    
    # Available Balance Card
    st.markdown("""
    <div class="balance-card">
        <p class="balance-label">Available Support Balance</p>
        <div class="balance-amount">$2,450</div>
        <p style="margin: 0; opacity: 0.8;">Last updated: Today</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Quick Actions
    st.markdown("### 🚀 Quick Actions")
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("📝 Apply for Support", key="apply_support", help="Submit a new financial assistance request"):
            st.session_state.current_page = 'support'
            st.rerun()
    
    with col2:
        if st.button("📊 Track Requests", key="track_requests", help="View your support request status"):
            st.session_state.current_page = 'requests'
            st.rerun()
    
    # Emergency Help Button
    st.markdown("### 🆘 Emergency Assistance")
    if st.button("🚨 Get Emergency Help", key="emergency", help="Access immediate financial assistance"):
        st.success("🚨 Emergency support team has been notified. You will be contacted within 15 minutes.")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Recent Transactions
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    st.markdown("### 📋 Recent Activity")
    
    # Sample transaction data
    transactions = [
        {"description": "Emergency Grant Approved", "amount": 500, "date": "2024-01-15", "type": "credit"},
        {"description": "Food Assistance", "amount": 200, "date": "2024-01-12", "type": "credit"},
        {"description": "Rent Support", "amount": 800, "date": "2024-01-10", "type": "credit"},
        {"description": "Application Fee", "amount": -25, "date": "2024-01-08", "type": "debit"},
    ]
    
    for transaction in transactions:
        amount_class = "transaction-positive" if transaction["amount"] > 0 else "transaction-negative"
        amount_sign = "+" if transaction["amount"] > 0 else ""
        
        st.markdown(f"""
        <div class="transaction-item">
            <div>
                <div style="font-weight: 600; margin-bottom: 0.2rem;">{transaction['description']}</div>
                <div style="font-size: 0.8rem; color: #666;">{transaction['date']}</div>
            </div>
            <div class="transaction-amount {amount_class}">
                {amount_sign}${abs(transaction['amount']):,}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.current_page == 'support':
    # Support Application Page
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    st.markdown("### 📝 Apply for Financial Support")
    
    with st.form("support_application"):
        st.markdown("**Personal Information**")
        col1, col2 = st.columns(2)
        with col1:
            first_name = st.text_input("First Name", placeholder="Enter your first name")
        with col2:
            last_name = st.text_input("Last Name", placeholder="Enter your last name")
        
        email = st.text_input("Email Address", placeholder="your.email@example.com")
        phone = st.text_input("Phone Number", placeholder="(555) 123-4567")
        
        st.markdown("**Support Request Details**")
        support_type = st.selectbox(
            "Type of Support Needed",
            ["Emergency Assistance", "Rent Support", "Food Assistance", "Medical Bills", "Utilities", "Other"]
        )
        
        amount_requested = st.number_input("Amount Requested ($)", min_value=50, max_value=5000, value=500)
        
        urgency = st.select_slider(
            "Urgency Level",
            options=["Low", "Medium", "High", "Critical"],
            value="Medium"
        )
        
        description = st.text_area(
            "Please describe your situation",
            placeholder="Explain why you need financial assistance and how it will help you..."
        )
        
        st.markdown("**Supporting Documents**")
        uploaded_files = st.file_uploader(
            "Upload supporting documents (optional)",
            accept_multiple_files=True,
            type=['pdf', 'jpg', 'png', 'doc', 'docx']
        )
        
        if st.form_submit_button("📤 Submit Application", use_container_width=True):
            st.success("✅ Your application has been submitted successfully!")
            st.info("📧 You will receive a confirmation email within 24 hours.")
            st.session_state.current_page = 'home'
            st.rerun()
    
    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.current_page == 'requests':
    # Support Requests Tracking
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    st.markdown("### 📊 Your Support Requests")
    
    # Sample requests data
    requests_data = [
        {
            "id": "REQ-001",
            "type": "Emergency Assistance",
            "amount": 500,
            "status": "approved",
            "date": "2024-01-15",
            "description": "Emergency medical expenses"
        },
        {
            "id": "REQ-002", 
            "type": "Rent Support",
            "amount": 800,
            "status": "processing",
            "date": "2024-01-12",
            "description": "Monthly rent assistance"
        },
        {
            "id": "REQ-003",
            "type": "Food Assistance", 
            "amount": 200,
            "status": "pending",
            "date": "2024-01-10",
            "description": "Grocery support for family"
        }
    ]
    
    for request in requests_data:
        status_class = f"status-{request['status']}"
        status_text = request['status'].title()
        
        st.markdown(f"""
        <div class="transaction-item">
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.2rem;">{request['type']}</div>
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.3rem;">{request['description']}</div>
                <div style="font-size: 0.7rem; color: #999;">Request #{request['id']} • {request['date']}</div>
            </div>
            <div style="text-align: right;">
                <div class="status-badge {status_class}">{status_text}</div>
                <div style="font-weight: 600; margin-top: 0.3rem;">${request['amount']:,}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.current_page == 'insights':
    # Financial Insights Page
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    st.markdown("### 📈 Financial Insights")
    
    # Financial health score
    health_score = 78
    st.markdown(f"""
    <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white; margin: 1rem 0;">
        <div style="font-size: 2rem; font-weight: 700;">{health_score}/100</div>
        <div>Financial Health Score</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Insights and recommendations
    insights = [
        "💡 Consider building an emergency fund of 3-6 months expenses",
        "📊 Your spending on food is 15% above average - consider meal planning",
        "🎯 You're on track to meet your financial goals this quarter",
        "💳 Your credit score has improved by 25 points this month"
    ]
    
    for insight in insights:
        st.markdown(f"""
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 0.5rem 0; border-left: 4px solid #4facfe;">
            {insight}
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)

elif st.session_state.current_page == 'profile':
    # Profile Page
    st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
    st.markdown("### 👤 Profile & Settings")
    
    col1, col2 = st.columns([1, 2])
    with col1:
        st.markdown("""
        <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white;">
                👤
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("**John Doe**")
        st.markdown("john.doe@email.com")
        st.markdown("Member since Jan 2024")
    
    st.markdown("---")
    
    # Profile settings
    st.markdown("**Account Settings**")
    if st.button("🔔 Notification Preferences", use_container_width=True):
        st.info("Notification settings opened")
    
    if st.button("🔒 Privacy & Security", use_container_width=True):
        st.info("Privacy settings opened")
    
    if st.button("📞 Contact Support", use_container_width=True):
        st.info("Support team contacted")
    
    if st.button("📋 Application History", use_container_width=True):
        st.session_state.current_page = 'requests'
        st.rerun()
    
    st.markdown("</div>", unsafe_allow_html=True)

# Bottom Navigation
st.markdown("""
<div class="bottom-nav">
    <a href="#" class="nav-item" onclick="window.parent.postMessage({type: 'streamlit:setComponentValue', key: 'nav_home'}, '*')">
        <div class="nav-icon">🏠</div>
        <div>Home</div>
    </a>
    <a href="#" class="nav-item" onclick="window.parent.postMessage({type: 'streamlit:setComponentValue', key: 'nav_requests'}, '*')">
        <div class="nav-icon">📋</div>
        <div>Requests</div>
    </a>
    <a href="#" class="nav-item" onclick="window.parent.postMessage({type: 'streamlit:setComponentValue', key: 'nav_insights'}, '*')">
        <div class="nav-icon">📊</div>
        <div>Insights</div>
    </a>
    <a href="#" class="nav-item" onclick="window.parent.postMessage({type: 'streamlit:setComponentValue', key: 'nav_profile'}, '*')">
        <div class="nav-icon">👤</div>
        <div>Profile</div>
    </a>
</div>
""", unsafe_allow_html=True)

# Navigation handlers
if st.button("🏠", key="nav_home", help="Home"):
    st.session_state.current_page = 'home'
    st.rerun()

if st.button("📋", key="nav_requests", help="Requests"):
    st.session_state.current_page = 'requests'
    st.rerun()

if st.button("📊", key="nav_insights", help="Insights"):
    st.session_state.current_page = 'insights'
    st.rerun()

if st.button("👤", key="nav_profile", help="Profile"):
    st.session_state.current_page = 'profile'
    st.rerun()

st.markdown('</div>', unsafe_allow_html=True)

# Add some spacing for bottom navigation
st.markdown("<br><br><br>", unsafe_allow_html=True)
