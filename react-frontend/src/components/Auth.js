import React, { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
    font-size: 0.875rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .input-container {
    position: relative;
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-right: ${props => props.hasPassword ? '3rem' : '1rem'};
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
  
  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #718096;
    
    &:hover {
      color: #4a5568;
    }
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const AuthSwitch = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  button {
    background: none;
    border: none;
    color: #667eea;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #22543d;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
        
        console.log('🔑 Token saved:', data.access_token.substring(0, 20) + '...');
        console.log('🔑 localStorage check:', localStorage.getItem('token') ? 'Present' : 'Missing');
        
        // Dispatch custom event to notify auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Get user info with timeout
        const userController = new AbortController();
        const userTimeoutId = setTimeout(() => userController.abort(), 5000);
        
        try {
          const userResponse = await fetch('http://127.0.0.1:8000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            },
            signal: userController.signal
          });
          
          clearTimeout(userTimeoutId);
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
            console.log('User data loaded:', userData);
          } else {
            // If user info fails, create fallback user data
            setUser({ username, full_name: username, id: Date.now() });
            console.log('Using fallback user data');
          }
        } catch (userError) {
          // If user info fails, still allow login but without user data
          console.warn('Could not fetch user info:', userError);
          setUser({ username, full_name: username, id: Date.now() }); // Fallback user data
        }
        
        toast.success('Login successful! Redirecting to dashboard...');
        
        // Force immediate UI update
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Also force a page refresh as backup
        setTimeout(() => {
          console.log('🔄 Forcing page reload due to redirect issue...');
          window.location.reload();
        }, 2000);
        
        return true;
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Login failed');
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Login timed out. Please try again.');
      } else {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, fullName) => {
    setLoading(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success('Account created successfully! Logging you in...');
        
        // Automatically log in the user after successful registration
        const loginSuccess = await login(username, password);
        if (loginSuccess) {
          // Force immediate UI update
          window.dispatchEvent(new CustomEvent('authStateChanged'));
          
          // Also force a page refresh as backup
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          
          return true;
        } else {
          toast.error('Account created but login failed. Please try logging in manually.');
          return false;
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Registration failed');
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Registration timed out. Please try again.');
      } else {
        console.error('Registration error:', error);
        toast.error('Registration failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    
    // Dispatch custom event to notify auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.username, formData.password);
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <h2>Welcome Back</h2>
          <p>Sign in to your FinMate account</p>
        </AuthHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Username</label>
            <div className="input-container">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Enter your username"
                required
              />
              <FiUser style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
            </div>
          </FormGroup>
          
          <FormGroup hasPassword>
            <label>Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </FormGroup>
          
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in... (3-8 seconds)' : 'Sign In'}
          </Button>
        </form>
        
        <AuthSwitch>
          <p>Don't have an account? <button onClick={onSwitchToRegister}>Sign up</button></p>
        </AuthSwitch>
      </AuthCard>
    </AuthContainer>
  );
};

export const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData.username, formData.email, formData.password, formData.fullName);
    if (success) {
      // Registration successful and user is now logged in
      // No need to switch to login form
      toast.success('Welcome to FinMate! You are now logged in.');
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <h2>Create Account</h2>
          <p>Join FinMate and take control of your finances</p>
        </AuthHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Full Name</label>
            <div className="input-container">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>
          </FormGroup>
          
          <FormGroup>
            <label>Username</label>
            <div className="input-container">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Choose a username"
                required
              />
              <FiUser style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
            </div>
          </FormGroup>
          
          <FormGroup>
            <label>Email</label>
            <div className="input-container">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
              <FiMail style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
            </div>
          </FormGroup>
          
          <FormGroup hasPassword>
            <label>Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </FormGroup>
          
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating account... (This may take 5-10 seconds)' : 'Create Account'}
          </Button>
        </form>
        
        <AuthSwitch>
          <p>Already have an account? <button onClick={onSwitchToLogin}>Sign in</button></p>
        </AuthSwitch>
      </AuthCard>
    </AuthContainer>
  );
};
