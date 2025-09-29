import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  background: ${props => props.theme.gradients.secondary};
  color: white;
  text-align: center;
  margin: 1rem;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 2rem 1.5rem;
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const BalanceLabel = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
`;

const BalanceAmount = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const LastUpdated = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const HealthScore = styled(motion.div)`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${props => props.theme.borderRadius.md};
  backdrop-filter: blur(10px);
  display: inline-block;
`;

const HealthScoreText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const HealthScoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

const BalanceCard = ({ balance, healthScore }) => {
  return (
    <CardContainer
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <BalanceLabel>Available Support Balance</BalanceLabel>
      <BalanceAmount
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        ${balance?.toLocaleString() || '0'}
      </BalanceAmount>
      <LastUpdated>Last updated: Today</LastUpdated>
      
      <HealthScore
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <HealthScoreText>Financial Health Score</HealthScoreText>
        <HealthScoreValue>{healthScore || 0}/100</HealthScoreValue>
      </HealthScore>
    </CardContainer>
  );
};

export default BalanceCard;
