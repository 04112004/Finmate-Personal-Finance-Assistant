#!/usr/bin/env python3
"""
Test the complete authentication flow
"""
import requests
import time
import json

def test_complete_auth_flow():
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing Complete Authentication Flow...")
    print("=" * 60)
    
    # Test user data
    test_user = {
        "username": f"testuser_{int(time.time())}",
        "email": f"test_{int(time.time())}@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    print("1️⃣ Testing User Registration...")
    start_time = time.time()
    
    try:
        # Register user
        register_response = requests.post(
            f"{base_url}/api/auth/register",
            json=test_user,
            timeout=10
        )
        
        register_time = time.time() - start_time
        
        if register_response.status_code == 200:
            print(f"✅ Registration successful! ({register_time:.2f}s)")
            print(f"   Username: {test_user['username']}")
            print(f"   Email: {test_user['email']}")
        else:
            print(f"❌ Registration failed: {register_response.status_code}")
            print(f"   Response: {register_response.text}")
            return
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    print("\n2️⃣ Testing User Login...")
    start_time = time.time()
    
    try:
        # Login user
        login_data = {
            "username": test_user["username"],
            "password": test_user["password"]
        }
        
        login_response = requests.post(
            f"{base_url}/api/auth/login",
            data=login_data,
            timeout=10
        )
        
        login_time = time.time() - start_time
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data.get("access_token")
            print(f"✅ Login successful! ({login_time:.2f}s)")
            print(f"   Token received: {token[:20]}...")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            return
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    print("\n3️⃣ Testing User Info Retrieval...")
    start_time = time.time()
    
    try:
        # Get user info
        user_response = requests.get(
            f"{base_url}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        
        user_time = time.time() - start_time
        
        if user_response.status_code == 200:
            user_data = user_response.json()
            print(f"✅ User info retrieved! ({user_time:.2f}s)")
            print(f"   User ID: {user_data.get('id')}")
            print(f"   Username: {user_data.get('username')}")
            print(f"   Email: {user_data.get('email')}")
        else:
            print(f"❌ User info failed: {user_response.status_code}")
            print(f"   Response: {user_response.text}")
            
    except Exception as e:
        print(f"❌ User info error: {e}")
    
    print("\n4️⃣ Testing Protected Endpoint...")
    start_time = time.time()
    
    try:
        # Test protected endpoint (get expenses)
        expenses_response = requests.get(
            f"{base_url}/api/expenses/expenses",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        
        expenses_time = time.time() - start_time
        
        if expenses_response.status_code == 200:
            print(f"✅ Protected endpoint accessible! ({expenses_time:.2f}s)")
            expenses_data = expenses_response.json()
            print(f"   Expenses count: {len(expenses_data)}")
        else:
            print(f"❌ Protected endpoint failed: {expenses_response.status_code}")
            print(f"   Response: {expenses_response.text}")
            
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Authentication Flow Test Complete!")
    print("\n💡 Expected Frontend Behavior:")
    print("   1. User fills registration form")
    print("   2. 'Account created successfully! Logging you in...' message")
    print("   3. 'Login successful! Redirecting to dashboard...' message")
    print("   4. Automatic redirect to main FinMate interface")
    print("   5. User sees dashboard with sidebar and all features")

if __name__ == "__main__":
    test_complete_auth_flow()
