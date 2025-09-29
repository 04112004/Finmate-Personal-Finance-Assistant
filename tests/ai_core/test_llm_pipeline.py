from ai_core.llm_pipeline import generate_ai_response

def test_generate_ai_response():
    user_input = "How to invest wisely?"
    response = generate_ai_response(user_input)
    assert "AI Advice" in response
