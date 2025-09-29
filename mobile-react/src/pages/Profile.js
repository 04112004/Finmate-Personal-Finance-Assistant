import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileContainer = styled(motion.div)`
  padding: 1rem;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.colors.gray50};
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
`;

const Avatar = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: ${props => props.theme.gradients.primary};
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const UserName = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 0.3rem;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray600};
  margin-bottom: 0.2rem;
`;

const MemberSince = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray500};
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.gray50};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray600};
`;

const SettingsCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
`;

const SettingsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 1rem;
`;

const SettingItem = styled(motion.button)`
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  text-align: left;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background: ${props => props.theme.colors.gray50};
  }
`;

const SettingIcon = styled.div`
  font-size: 1.2rem;
  margin-right: 0.8rem;
`;

const SettingText = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.gray700};
`;

const SettingArrow = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray400};
`;

const Profile = ({ onPageChange }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProfile = {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        memberSince: '2024-01-15',
        totalSupportReceived: 1500.00,
        applicationsSubmitted: 3,
        successRate: 85.7,
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsAlerts: false
        }
      };
      
      setUserProfile(mockProfile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingClick = (setting) => {
    switch (setting) {
      case 'notifications':
        toast.success('🔔 Notification preferences opened');
        break;
      case 'privacy':
        toast.success('🔒 Privacy settings opened');
        break;
      case 'support':
        toast.success('📞 Support team contacted');
        break;
      case 'history':
        onPageChange('requests');
        break;
      case 'logout':
        toast.success('👋 Logged out successfully');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '300px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px' }} />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header */}
      <ProfileCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Avatar
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          👤
        </Avatar>
        <UserName>{userProfile?.name}</UserName>
        <UserEmail>{userProfile?.email}</UserEmail>
        <MemberSince>Member since {new Date(userProfile?.memberSince).toLocaleDateString()}</MemberSince>
        
        <StatsGrid>
          <StatCard
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <StatValue>${userProfile?.totalSupportReceived?.toLocaleString()}</StatValue>
            <StatLabel>Total Support</StatLabel>
          </StatCard>
          <StatCard
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <StatValue>{userProfile?.successRate}%</StatValue>
            <StatLabel>Success Rate</StatLabel>
          </StatCard>
        </StatsGrid>
      </ProfileCard>

      {/* Account Settings */}
      <SettingsCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SettingsTitle>⚙️ Account Settings</SettingsTitle>
        
        <SettingItem
          onClick={() => handleSettingClick('notifications')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>🔔</SettingIcon>
          <SettingText>Notification Preferences</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
        
        <SettingItem
          onClick={() => handleSettingClick('privacy')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>🔒</SettingIcon>
          <SettingText>Privacy & Security</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
        
        <SettingItem
          onClick={() => handleSettingClick('support')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>📞</SettingIcon>
          <SettingText>Contact Support</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
        
        <SettingItem
          onClick={() => handleSettingClick('history')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>📋</SettingIcon>
          <SettingText>Application History</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
      </SettingsCard>

      {/* Quick Actions */}
      <SettingsCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <SettingsTitle>🚀 Quick Actions</SettingsTitle>
        
        <SettingItem
          onClick={() => onPageChange('support')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>📝</SettingIcon>
          <SettingText>Submit New Application</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
        
        <SettingItem
          onClick={() => onPageChange('insights')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <SettingIcon>📊</SettingIcon>
          <SettingText>View Financial Insights</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
        
        <SettingItem
          onClick={() => handleSettingClick('logout')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ color: '#ef4444' }}
        >
          <SettingIcon>👋</SettingIcon>
          <SettingText style={{ color: '#ef4444' }}>Log Out</SettingText>
          <SettingArrow>›</SettingArrow>
        </SettingItem>
      </SettingsCard>
    </ProfileContainer>
  );
};

export default Profile;
