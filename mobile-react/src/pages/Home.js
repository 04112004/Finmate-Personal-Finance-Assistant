import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Components
import BalanceCard from '../components/BalanceCard';
import QuickAction from '../components/QuickAction';
import TransactionList from '../components/TransactionList';
import EmergencyButton from '../components/EmergencyButton';

const HomeContainer = styled(motion.div)`
  padding: 1rem;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.colors.gray50};
`;

const Section = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Home = ({ onPageChange }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        available_balance: 2450.00,
        recent_transactions: [
          {
            id: 1,
            description: "Emergency Grant Approved",
            amount: 500,
            date: "2024-01-15",
            type: "credit",
            category: "Emergency Support"
          },
          {
            id: 2,
            description: "Food Assistance",
            amount: 200,
            date: "2024-01-12",
            type: "credit",
            category: "Food Support"
          },
          {
            id: 3,
            description: "Rent Support",
            amount: 800,
            date: "2024-01-10",
            type: "credit",
            category: "Housing Support"
          },
          {
            id: 4,
            description: "Application Fee",
            amount: -25,
            date: "2024-01-08",
            type: "debit",
            category: "Fees"
          }
        ],
        financial_health_score: 78,
        pending_requests: 2,
        total_support_received: 1500.00
      };
      
      setDashboardData(mockData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'apply':
        navigate('/support');
        onPageChange('support');
        break;
      case 'track':
        navigate('/requests');
        onPageChange('requests');
        break;
      case 'insights':
        navigate('/insights');
        onPageChange('insights');
        break;
      default:
        break;
    }
  };

  const handleEmergency = () => {
    toast.success('🚨 Emergency support team notified! You will be contacted within 15 minutes.');
  };

  if (isLoading) {
    return (
      <HomeContainer>
        <Section>
          <div className="shimmer" style={{ height: '200px', borderRadius: '16px', marginBottom: '1rem' }} />
          <div className="shimmer" style={{ height: '100px', borderRadius: '12px', marginBottom: '1rem' }} />
          <div className="shimmer" style={{ height: '300px', borderRadius: '12px' }} />
        </Section>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Balance Card */}
      <Section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <BalanceCard 
          balance={dashboardData?.available_balance}
          healthScore={dashboardData?.financial_health_score}
        />
      </Section>

      {/* Quick Actions */}
      <Section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SectionTitle>🚀 Quick Actions</SectionTitle>
        <QuickActionsGrid>
          <QuickAction
            title="📝 Apply for Support"
            subtitle="Submit new request"
            gradient="success"
            onClick={() => handleQuickAction('apply')}
            icon="📝"
          />
          <QuickAction
            title="📊 Track Requests"
            subtitle="View status"
            gradient="warning"
            onClick={() => handleQuickAction('track')}
            icon="📊"
          />
        </QuickActionsGrid>
      </Section>

      {/* Emergency Help */}
      <Section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <SectionTitle>🆘 Emergency Assistance</SectionTitle>
        <EmergencyButton onClick={handleEmergency} />
      </Section>

      {/* Recent Transactions */}
      <Section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <SectionTitle>📋 Recent Activity</SectionTitle>
        <TransactionList transactions={dashboardData?.recent_transactions} />
      </Section>
    </HomeContainer>
  );
};

export default Home;
