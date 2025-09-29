from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import random

router = APIRouter()

class SupportApplication(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    support_type: str
    amount_requested: float
    urgency: str
    description: str
    supporting_documents: Optional[List[str]] = None

class SupportRequest(BaseModel):
    id: str
    type: str
    amount: float
    status: str
    date: str
    description: str
    approved_amount: Optional[float] = None
    processing_notes: Optional[str] = None

class FinancialInsight(BaseModel):
    category: str
    message: str
    priority: str
    actionable: bool

@router.get("/dashboard")
def get_dashboard_data():
    """
    Get dashboard data for the mobile app
    """
    try:
        # Simulate user financial data
        available_balance = random.uniform(2000, 5000)
        
        # Recent transactions
        transactions = [
            {
                "description": "Emergency Grant Approved",
                "amount": random.uniform(300, 800),
                "date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
                "type": "credit",
                "category": "Emergency Support"
            },
            {
                "description": "Food Assistance",
                "amount": random.uniform(150, 300),
                "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
                "type": "credit",
                "category": "Food Support"
            },
            {
                "description": "Rent Support",
                "amount": random.uniform(600, 1200),
                "date": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                "type": "credit",
                "category": "Housing Support"
            },
            {
                "description": "Application Fee",
                "amount": -25,
                "date": (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d"),
                "type": "debit",
                "category": "Fees"
            }
        ]
        
        return {
            "available_balance": round(available_balance, 2),
            "recent_transactions": transactions,
            "financial_health_score": random.randint(65, 95),
            "pending_requests": random.randint(0, 3),
            "total_support_received": round(sum(t["amount"] for t in transactions if t["amount"] > 0), 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/support/apply")
def submit_support_application(application: SupportApplication):
    """
    Submit a new support application
    """
    try:
        # Generate application ID
        app_id = f"REQ-{random.randint(1000, 9999)}"
        
        # Simulate processing
        estimated_processing_time = {
            "Critical": "2-4 hours",
            "High": "1-2 days", 
            "Medium": "3-5 days",
            "Low": "1-2 weeks"
        }
        
        return {
            "application_id": app_id,
            "status": "submitted",
            "estimated_processing_time": estimated_processing_time.get(application.urgency, "3-5 days"),
            "confirmation_email_sent": True,
            "next_steps": [
                "You will receive a confirmation email within 24 hours",
                "Our team will review your application",
                "You may be contacted for additional information",
                "A decision will be made within the estimated timeframe"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/support/requests")
def get_support_requests():
    """
    Get user's support requests
    """
    try:
        # Sample support requests
        requests = [
            {
                "id": "REQ-001",
                "type": "Emergency Assistance",
                "amount": 500,
                "status": "approved",
                "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
                "description": "Emergency medical expenses",
                "approved_amount": 500,
                "processing_notes": "Approved for full amount. Funds transferred to your account."
            },
            {
                "id": "REQ-002",
                "type": "Rent Support", 
                "amount": 800,
                "status": "processing",
                "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                "description": "Monthly rent assistance",
                "approved_amount": None,
                "processing_notes": "Under review. Additional documentation requested."
            },
            {
                "id": "REQ-003",
                "type": "Food Assistance",
                "amount": 200,
                "status": "pending",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "description": "Grocery support for family",
                "approved_amount": None,
                "processing_notes": "Application received. Initial review in progress."
            }
        ]
        
        return {"requests": requests}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/insights")
def get_financial_insights():
    """
    Get personalized financial insights
    """
    try:
        insights = [
            {
                "category": "Emergency Fund",
                "message": "Consider building an emergency fund of 3-6 months expenses",
                "priority": "high",
                "actionable": True,
                "action": "Set up automatic savings of $100/month"
            },
            {
                "category": "Spending Analysis",
                "message": "Your spending on food is 15% above average - consider meal planning",
                "priority": "medium", 
                "actionable": True,
                "action": "Try meal prep to reduce food costs"
            },
            {
                "category": "Goal Progress",
                "message": "You're on track to meet your financial goals this quarter",
                "priority": "low",
                "actionable": False,
                "action": None
            },
            {
                "category": "Credit Score",
                "message": "Your credit score has improved by 25 points this month",
                "priority": "low",
                "actionable": False,
                "action": None
            }
        ]
        
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/emergency/contact")
def get_emergency_contact():
    """
    Get emergency contact information
    """
    try:
        return {
            "emergency_phone": "1-800-FIN-HELP",
            "emergency_email": "emergency@finsupport.org",
            "response_time": "15 minutes",
            "available_24_7": True,
            "languages_supported": ["English", "Spanish", "French", "Mandarin"],
            "services": [
                "Immediate financial assistance",
                "Crisis counseling",
                "Resource referrals",
                "Emergency housing support"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/profile")
def get_user_profile():
    """
    Get user profile information
    """
    try:
        return {
            "user_id": "USR-12345",
            "name": "John Doe",
            "email": "john.doe@email.com",
            "phone": "(555) 123-4567",
            "member_since": "2024-01-15",
            "total_support_received": 1500.00,
            "applications_submitted": 3,
            "success_rate": 85.7,
            "preferences": {
                "notifications": True,
                "email_updates": True,
                "sms_alerts": False
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/profile/update")
def update_user_profile(profile_data: Dict[str, Any]):
    """
    Update user profile
    """
    try:
        # Simulate profile update
        return {
            "status": "updated",
            "updated_fields": list(profile_data.keys()),
            "last_updated": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
