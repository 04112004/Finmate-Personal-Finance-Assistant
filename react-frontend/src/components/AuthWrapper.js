import React, { useState, useEffect } from 'react';
import { useAuth, LoginForm, RegisterForm } from './Auth';
import { useAuthState } from '../hooks/useAuthState';
import { useForceUpdate } from '../hooks/useForceUpdate';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AuthWrapperContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const AuthCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-width: 500px;
  width: 100%;
`;

const AuthHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.9;
    font-size: 1rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const AuthWrapper = ({ children }) => {
  const { user, token, loading } = useAuth();
  const { isAuthenticated, isLoading: authStateLoading } = useAuthState();
  const [isLogin, setIsLogin] = useState(true);
  const forceUpdate = useForceUpdate();

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('Auth state changed, forcing update...');
      forceUpdate();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, [forceUpdate]);

  // Check token and force re-render when it changes
  const [hasToken, setHasToken] = useState(localStorage.getItem('token'));
  
  // Check token periodically and on auth changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== hasToken) {
        console.log('Token changed:', currentToken ? 'Present' : 'Missing');
        setHasToken(currentToken);
      }
    };

    // Check immediately
    checkToken();

    // Set up interval to check periodically
    const interval = setInterval(checkToken, 100);

    return () => clearInterval(interval);
  }, [hasToken]);

  if (authStateLoading) {
    return (
      <AuthWrapperContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </AuthWrapperContainer>
    );
  }

  // Show login if no token
  if (!hasToken) {
    return (
      <AuthWrapperContainer>
        <AuthCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthHeader>
            <h1>FinMate</h1>
            <p>Your Personal Finance Assistant</p>
          </AuthHeader>
          
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </AuthCard>
      </AuthWrapperContainer>
    );
  }

  // If we have a token, show the app
  console.log('✅ User authenticated, showing main app');
  return children;
};
