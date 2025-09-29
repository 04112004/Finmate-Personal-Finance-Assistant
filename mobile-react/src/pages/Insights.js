import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const InsightsContainer = styled(motion.div)`
  padding: 1rem;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.colors.gray50};
`;

const InsightCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 1rem;
`;

const HealthScoreContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${props => props.theme.gradients.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: white;
  margin-bottom: 1rem;
`;

const HealthScoreValue = styled(motion.div)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const HealthScoreLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const InsightItem = styled(motion.div)`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 0.5rem;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'high':
        return props.theme.colors.danger;
      case 'medium':
        return props.theme.colors.warning;
      case 'low':
        return props.theme.colors.success;
      default:
        return props.theme.colors.gray300;
    }
  }};
  background: ${props => props.theme.colors.gray50};
`;

const InsightMessage = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray700};
  margin-bottom: 0.3rem;
`;

const InsightAction = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const ChartContainer = styled.div`
  height: 200px;
  margin: 1rem 0;
`;

const Insights = ({ onPageChange }) => {
  const [insights, setInsights] = useState([]);
  const [healthScore, setHealthScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const spendingData = [
    { name: 'Housing', value: 1800, color: '#667eea' },
    { name: 'Food', value: 600, color: '#4facfe' },
    { name: 'Transportation', value: 400, color: '#56ab2f' },
    { name: 'Entertainment', value: 300, color: '#ff9a9e' },
    { name: 'Utilities', value: 250, color: '#ff6b6b' },
    { name: 'Healthcare', value: 200, color: '#a8e6cf' },
    { name: 'Other', value: 150, color: '#fecfef' }
  ];

  const monthlyData = [
    { month: 'Jan', income: 6000, expenses: 4200, savings: 1800 },
    { month: 'Feb', income: 6200, expenses: 4500, savings: 1700 },
    { month: 'Mar', income: 5800, expenses: 3800, savings: 2000 },
    { month: 'Apr', income: 6400, expenses: 4600, savings: 1800 },
    { month: 'May', income: 6100, expenses: 4300, savings: 1800 },
    { month: 'Jun', income: 6300, expenses: 4400, savings: 1900 }
  ];

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInsights = [
        {
          category: 'Emergency Fund',
          message: 'Consider building an emergency fund of 3-6 months expenses',
          priority: 'high',
          actionable: true,
          action: 'Set up automatic savings of $100/month'
        },
        {
          category: 'Spending Analysis',
          message: 'Your spending on food is 15% above average - consider meal planning',
          priority: 'medium',
          actionable: true,
          action: 'Try meal prep to reduce food costs'
        },
        {
          category: 'Goal Progress',
          message: 'You\'re on track to meet your financial goals this quarter',
          priority: 'low',
          actionable: false,
          action: null
        },
        {
          category: 'Credit Score',
          message: 'Your credit score has improved by 25 points this month',
          priority: 'low',
          actionable: false,
          action: null
        }
      ];
      
      setInsights(mockInsights);
      setHealthScore(78);
    } catch (error) {
      console.error('Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <InsightsContainer>
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '300px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px' }} />
      </InsightsContainer>
    );
  }

  return (
    <InsightsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Financial Health Score */}
      <InsightCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <HealthScoreContainer>
          <HealthScoreValue
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          >
            {healthScore}/100
          </HealthScoreValue>
          <HealthScoreLabel>Financial Health Score</HealthScoreLabel>
        </HealthScoreContainer>
      </InsightCard>

      {/* Spending Breakdown */}
      <InsightCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CardTitle>📊 Spending Breakdown</CardTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </InsightCard>

      {/* Monthly Trends */}
      <InsightCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <CardTitle>📈 Monthly Trends</CardTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Bar dataKey="income" fill="#667eea" name="Income" />
              <Bar dataKey="expenses" fill="#ff6b6b" name="Expenses" />
              <Bar dataKey="savings" fill="#56ab2f" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </InsightCard>

      {/* Personalized Insights */}
      <InsightCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <CardTitle>💡 Personalized Insights</CardTitle>
        {insights.map((insight, index) => (
          <InsightItem
            key={index}
            priority={insight.priority}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <InsightMessage>{insight.message}</InsightMessage>
            {insight.actionable && insight.action && (
              <InsightAction>💡 {insight.action}</InsightAction>
            )}
          </InsightItem>
        ))}
      </InsightCard>
    </InsightsContainer>
  );
};

export default Insights;
