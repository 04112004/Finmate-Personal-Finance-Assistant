import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  background: ${props => props.theme.gradients.primary};
  padding: 2rem 1.5rem 1rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const Title = styled(motion.h1)`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
`;

const Subtitle = styled(motion.p)`
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0.5rem 0 0;
  position: relative;
  z-index: 1;
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: ${props => props.theme.colors.danger};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
`;

const Header = () => {
  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Title
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        🤝 FinSupport
      </Title>
      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Financial Assistance & Support Platform
      </Subtitle>
      <NotificationBadge
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        3
      </NotificationBadge>
    </HeaderContainer>
  );
};

export default Header;
