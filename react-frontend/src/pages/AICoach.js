import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AICoachContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const ChatContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      background: #667eea;
      color: white;
    }
  }
  
  &.ai {
    .message-content {
      background: #f7fafc;
      color: #1a202c;
    }
  }
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.user ? '#667eea' : '#e2e8f0'};
  color: ${props => props.user ? 'white' : '#667eea'};
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const InputForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.25rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const Suggestions = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 1rem;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SuggestionChip = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4a5568;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const sampleSuggestions = [
  "How can I improve my credit score?",
  "What's the best way to save for retirement?",
  "Should I invest in stocks or bonds?",
  "How much should I save for an emergency fund?",
  "What's the 50/30/20 rule?",
  "How do I create a budget?"
];

function AICoach() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Financial Coach. I'm here to help you with any financial questions or concerns you might have. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Call real backend API
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to the AI service right now. Please make sure the backend is running on port 8000."
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <AICoachContainer>
      <Header>
        <h1>
          <FiMessageCircle />
          AI Financial Coach
        </h1>
        <p>Get personalized financial advice powered by AI</p>
      </Header>

      <Suggestions>
        <h3>Quick Questions</h3>
        <SuggestionChips>
          {sampleSuggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              onClick={() => handleSuggestion(suggestion)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
            </SuggestionChip>
          ))}
        </SuggestionChips>
      </Suggestions>

      <ChatContainer>
        <MessagesContainer>
          {messages.map((message) => (
            <Message
              key={message.id}
              className={message.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageIcon user={message.type === 'user'}>
                {message.type === 'user' ? 'U' : <FiMessageCircle />}
              </MessageIcon>
              <MessageContent className="message-content">
                {message.content}
              </MessageContent>
            </Message>
          ))}
          {loading && (
            <Message className="ai">
              <MessageIcon>
                <FiMessageCircle />
              </MessageIcon>
              <MessageContent className="message-content">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Thinking...
                </motion.div>
              </MessageContent>
            </Message>
          )}
        </MessagesContainer>

        <InputContainer>
          <InputForm onSubmit={handleSubmit}>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your finances..."
              disabled={loading}
            />
            <SendButton type="submit" disabled={loading || !input.trim()}>
              <FiSend />
              Send
            </SendButton>
          </InputForm>
        </InputContainer>
      </ChatContainer>
    </AICoachContainer>
  );
}

export default AICoach;
