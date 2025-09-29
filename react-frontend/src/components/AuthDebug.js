import React, { useState, useEffect } from 'react';

export const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    token: null,
    user: null,
    loading: false
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = localStorage.getItem('token');
      setDebugInfo({
        token: token,
        user: null, // We'll get this from context if needed
        loading: false
      });
    };

    updateDebugInfo();
    
    // Update every 500ms
    const interval = setInterval(updateDebugInfo, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(255,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 99999,
      fontFamily: 'Arial, sans-serif',
      border: '2px solid #fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      minWidth: '200px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 AUTH DEBUG</div>
      <div>Token: {debugInfo.token ? '✅ Present' : '❌ Missing'}</div>
      <div>User: {debugInfo.user ? `✅ ${debugInfo.user}` : '❌ Not loaded'}</div>
      <div>Loading: {debugInfo.loading ? '⏳ Yes' : '✅ No'}</div>
      <div>Auth State: {debugInfo.token ? '🔓 Authenticated' : '🔒 Not Authenticated'}</div>
    </div>
  );
};
