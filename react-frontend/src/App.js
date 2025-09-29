import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import { AuthProvider } from './components/Auth';
import { AuthWrapper } from './components/AuthWrapper';

// Pages
import Dashboard from './pages/Dashboard';
import AICoach from './pages/AICoach';
import BudgetPlanner from './pages/BudgetPlanner';
import SavingsGoals from './pages/SavingsGoals';
import ExpenseTracker from './pages/ExpenseTracker';
import InvestmentAdvisor from './pages/InvestmentAdvisor';
import SmartFeatures from './pages/SmartFeatures';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const PageContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Router>
          <AppContainer>
            <Sidebar />
            <MainContent
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={
                  <PageContainer>
                    <Dashboard />
                  </PageContainer>
                } />
                <Route path="/dashboard" element={
                  <PageContainer>
                    <Dashboard />
                  </PageContainer>
                } />
                <Route path="/ai-coach" element={
                  <PageContainer>
                    <AICoach />
                  </PageContainer>
                } />
                <Route path="/budget" element={
                  <PageContainer>
                    <BudgetPlanner />
                  </PageContainer>
                } />
                <Route path="/savings" element={
                  <PageContainer>
                    <SavingsGoals />
                  </PageContainer>
                } />
                <Route path="/expenses" element={
                  <PageContainer>
                    <ExpenseTracker />
                  </PageContainer>
                } />
                <Route path="/investments" element={
                  <PageContainer>
                    <InvestmentAdvisor />
                  </PageContainer>
                } />
                <Route path="/smart-features" element={
                  <PageContainer>
                    <SmartFeatures />
                  </PageContainer>
                } />
              </Routes>
            </MainContent>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AppContainer>
        </Router>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;
