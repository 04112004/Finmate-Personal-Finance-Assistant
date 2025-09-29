#!/usr/bin/env python3
"""
Create a test user for faster development
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, create_tables
from models.database_models import User
from auth import get_password_hash

def create_test_user():
    # Create tables first
    create_tables()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.username == "testuser").first()
        if existing_user:
            print("✅ Test user already exists!")
            print(f"Username: testuser")
            print(f"Password: testpass123")
            return
        
        # Create test user
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password=get_password_hash("testpass123"),
            full_name="Test User",
            is_active=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print(f"Username: testuser")
        print(f"Password: testpass123")
        print(f"Email: test@example.com")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
