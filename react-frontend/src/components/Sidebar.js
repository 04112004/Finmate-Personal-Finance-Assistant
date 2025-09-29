import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiMessageCircle, 
  FiPieChart, 
  FiTarget, 
  FiCreditCard, 
  FiTrendingUp, 
  FiZap,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from './Auth';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  padding: 2rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Nav = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-left-color: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: white;
    font-weight: 600;
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/ai-coach', label: 'AI Coach', icon: FiMessageCircle },
  { path: '/budget', label: 'Budget Planner', icon: FiPieChart },
  { path: '/savings', label: 'Savings Goals', icon: FiTarget },
  { path: '/expenses', label: 'Expense Tracker', icon: FiCreditCard },
  { path: '/investments', label: 'Investment Advisor', icon: FiTrendingUp },
  { path: '/smart-features', label: 'Smart Features', icon: FiZap },
];

const LogoutButton = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <MobileToggle onClick={() => setIsMobileOpen(!isMobileOpen)}>
        ☰
      </MobileToggle>
      
      <SidebarContainer 
        className={isMobileOpen ? 'open' : ''}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Logo>
          <h1>
            💰 FinMate
          </h1>
          {user && (
            <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Welcome, {user.full_name || user.username}!
            </p>
          )}
        </Logo>
        
        <Nav>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon />
                {item.label}
              </NavItem>
            );
          })}
        </Nav>
        
        <LogoutButton onClick={logout}>
          <FiLogOut />
          Logout
        </LogoutButton>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
