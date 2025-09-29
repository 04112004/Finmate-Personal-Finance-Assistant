import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NavContainer = styled(motion.nav)`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 400px;
  background: white;
  border-top: 1px solid ${props => props.theme.colors.gray200};
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavItem = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  text-decoration: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray500};
  font-size: 0.8rem;
  font-weight: ${props => props.active ? '600' : '400'};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius.md};
  min-width: 60px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray50};
  }
`;

const NavIcon = styled(motion.div)`
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
`;

const BottomNavigation = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'requests', label: 'Requests', icon: '📋', path: '/requests' },
    { id: 'insights', label: 'Insights', icon: '📊', path: '/insights' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
  ];

  const handleNavClick = (item) => {
    onPageChange(item.id);
    navigate(item.path);
  };

  return (
    <NavContainer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          active={currentPage === item.id}
          onClick={() => handleNavClick(item)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavIcon
            animate={currentPage === item.id ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {item.icon}
          </NavIcon>
          <span>{item.label}</span>
          {currentPage === item.id && (
            <ActiveIndicator
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default BottomNavigation;
