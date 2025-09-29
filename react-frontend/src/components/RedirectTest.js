import React, { useState, useEffect } from 'react';

export const RedirectTest = () => {
  const [tokenStatus, setTokenStatus] = useState('Missing');

  useEffect(() => {
    console.log('🔍 RedirectTest: Component mounted');
    
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const status = token ? 'Present' : 'Missing';
      setTokenStatus(status);
      
      console.log('🔍 RedirectTest: Token check:', status);
      
      if (token) {
        console.log('✅ RedirectTest: User should be redirected to main app');
      } else {
        console.log('❌ RedirectTest: User should see login form');
      }
    };

    checkAuth();
    
    // Check every 500ms
    const interval = setInterval(checkAuth, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,255,0,0.9)',
      color: 'black',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 99999,
      fontFamily: 'Arial, sans-serif',
      border: '2px solid #000',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🚀 REDIRECT TEST</div>
      <div>Token: {tokenStatus === 'Present' ? '✅ Present' : '❌ Missing'}</div>
      <div>Should redirect: {tokenStatus === 'Present' ? '✅ Yes' : '❌ No'}</div>
    </div>
  );
};
