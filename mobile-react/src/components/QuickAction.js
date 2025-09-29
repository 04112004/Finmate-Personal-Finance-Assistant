import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ActionButton = styled(motion.button)`
  background: ${props => {
    switch (props.gradient) {
      case 'success':
        return props.theme.gradients.success;
      case 'warning':
        return props.theme.gradients.warning;
      case 'danger':
        return props.theme.gradients.danger;
      default:
        return props.theme.gradients.primary;
    }
  }};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem 1rem;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const ActionIcon = styled(motion.div)`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ActionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const ActionSubtitle = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  font-weight: 400;
`;

const QuickAction = ({ title, subtitle, gradient, onClick, icon }) => {
  return (
    <ActionButton
      gradient={gradient}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ActionIcon
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icon}
      </ActionIcon>
      <ActionTitle>{title}</ActionTitle>
      <ActionSubtitle>{subtitle}</ActionSubtitle>
    </ActionButton>
  );
};

export default QuickAction;
