from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_chat_endpoint():
    response = client.post("/api/ai/chat", params={"message": "How to save money?"})
    assert response.status_code == 200
    assert "response" in response.json()
