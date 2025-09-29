import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const EmergencyContainer = styled(motion.div)`
  background: ${props => props.theme.gradients.danger};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
  position: relative;
  overflow: hidden;
`;

const EmergencyIcon = styled(motion.div)`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const EmergencyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const EmergencySubtitle = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const EmergencyButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const PulseRing = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const EmergencyButtonComponent = ({ onClick }) => {
  return (
    <EmergencyContainer
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <PulseRing
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <EmergencyIcon
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        🚨
      </EmergencyIcon>
      
      <EmergencyTitle>Emergency Financial Help</EmergencyTitle>
      <EmergencySubtitle>
        Get immediate assistance for urgent financial needs
      </EmergencySubtitle>
      
      <EmergencyButton
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: [
            "0 6px 20px rgba(255, 107, 107, 0.3)",
            "0 8px 25px rgba(255, 107, 107, 0.5)",
            "0 6px 20px rgba(255, 107, 107, 0.3)"
          ]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        Get Emergency Help
      </EmergencyButton>
    </EmergencyContainer>
  );
};

export default EmergencyButtonComponent;
