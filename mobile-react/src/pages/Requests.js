import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RequestsContainer = styled(motion.div)`
  padding: 1rem;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.colors.gray50};
`;

const RequestCard = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: ${props => props.theme.shadows.md};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'approved':
        return props.theme.colors.success;
      case 'processing':
        return props.theme.colors.primary;
      case 'pending':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.gray300;
    }
  }};
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 0.3rem;
`;

const RequestDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray600};
  margin-bottom: 0.5rem;
`;

const RequestMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray500};
`;

const StatusBadge = styled(motion.div)`
  padding: 0.4rem 0.8rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'approved':
        return props.theme.colors.success;
      case 'processing':
        return props.theme.colors.primary;
      case 'pending':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.gray300;
    }
  }};
  color: white;
`;

const RequestAmount = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 0.5rem;
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray200};
`;

const DetailItem = styled.div`
  text-align: center;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray500};
  margin-bottom: 0.2rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.gray500};
`;

const Requests = ({ onPageChange }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRequests = [
        {
          id: 'REQ-001',
          type: 'Emergency Assistance',
          amount: 500,
          status: 'approved',
          date: '2024-01-15',
          description: 'Emergency medical expenses',
          approvedAmount: 500,
          processingNotes: 'Approved for full amount. Funds transferred to your account.'
        },
        {
          id: 'REQ-002',
          type: 'Rent Support',
          amount: 800,
          status: 'processing',
          date: '2024-01-12',
          description: 'Monthly rent assistance',
          approvedAmount: null,
          processingNotes: 'Under review. Additional documentation requested.'
        },
        {
          id: 'REQ-003',
          type: 'Food Assistance',
          amount: 200,
          status: 'pending',
          date: '2024-01-10',
          description: 'Grocery support for family',
          approvedAmount: null,
          processingNotes: 'Application received. Initial review in progress.'
        }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'processing':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <RequestsContainer>
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px', marginBottom: '1rem' }} />
        <div className="shimmer" style={{ height: '200px', borderRadius: '16px' }} />
      </RequestsContainer>
    );
  }

  if (requests.length === 0) {
    return (
      <RequestsContainer>
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '0.5rem', color: '#64748b' }}>No Requests Yet</h3>
          <p style={{ color: '#94a3b8' }}>Submit your first support request to get started</p>
        </EmptyState>
      </RequestsContainer>
    );
  }

  return (
    <RequestsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {requests.map((request, index) => (
        <RequestCard
          key={request.id}
          status={request.status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <RequestHeader>
            <RequestInfo>
              <RequestTitle>{request.type}</RequestTitle>
              <RequestDescription>{request.description}</RequestDescription>
              <RequestMeta>
                Request #{request.id} • {new Date(request.date).toLocaleDateString()}
              </RequestMeta>
            </RequestInfo>
            <StatusBadge
              status={request.status}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            >
              {request.status}
            </StatusBadge>
          </RequestHeader>

          <RequestAmount>
            ${request.amount.toLocaleString()}
          </RequestAmount>

          {request.approvedAmount && (
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#56ab2f', 
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              ✅ Approved: ${request.approvedAmount.toLocaleString()}
            </div>
          )}

          <div style={{ 
            fontSize: '0.8rem', 
            color: '#64748b',
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            {request.processingNotes}
          </div>

          <RequestDetails>
            <DetailItem>
              <DetailLabel>Requested</DetailLabel>
              <DetailValue>${request.amount.toLocaleString()}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue style={{ 
                color: request.status === 'approved' ? '#56ab2f' : 
                       request.status === 'processing' ? '#667eea' : '#ff9a9e'
              }}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </DetailValue>
            </DetailItem>
          </RequestDetails>
        </RequestCard>
      ))}
    </RequestsContainer>
  );
};

export default Requests;
