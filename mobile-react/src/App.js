import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Support from './pages/Support';
import Requests from './pages/Requests';
import Insights from './pages/Insights';
import Profile from './pages/Profile';

// Theme
const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#764ba2',
    secondary: '#4facfe',
    secondaryLight: '#00f2fe',
    success: '#56ab2f',
    successLight: '#a8e6cf',
    warning: '#ff9a9e',
    warningLight: '#fecfef',
    danger: '#ff6b6b',
    dangerLight: '#ffa8a8',
    white: '#ffffff',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    success: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
    warning: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    danger: 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.gray50};
  position: relative;
  padding-bottom: 80px; /* Space for bottom navigation */
`;

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: 0;
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header />
        
        <AnimatePresence mode="wait">
          <PageContainer
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes>
              <Route path="/" element={<Home onPageChange={handlePageChange} />} />
              <Route path="/support" element={<Support onPageChange={handlePageChange} />} />
              <Route path="/requests" element={<Requests onPageChange={handlePageChange} />} />
              <Route path="/insights" element={<Insights onPageChange={handlePageChange} />} />
              <Route path="/profile" element={<Profile onPageChange={handlePageChange} />} />
            </Routes>
          </PageContainer>
        </AnimatePresence>

        <BottomNavigation 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
        />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
