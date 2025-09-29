import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TransactionContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const TransactionItem = styled(motion.div)`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.gray100};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.gray50};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionDescription = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 0.2rem;
`;

const TransactionDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray500};
  margin-bottom: 0.2rem;
`;

const TransactionCategory = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.gray50};
  padding: 0.2rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: inline-block;
`;

const TransactionAmount = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.danger};
`;

const TransactionIcon = styled(motion.div)`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <TransactionContainer>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          No recent transactions
        </div>
      </TransactionContainer>
    );
  }

  return (
    <TransactionContainer>
      {transactions.map((transaction, index) => (
        <TransactionItem
          key={transaction.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ x: 5 }}
        >
          <TransactionIcon
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {transaction.type === 'credit' ? '💰' : '💸'}
          </TransactionIcon>
          
          <TransactionInfo>
            <TransactionDescription>
              {transaction.description}
            </TransactionDescription>
            <TransactionDate>
              {new Date(transaction.date).toLocaleDateString()}
            </TransactionDate>
            <TransactionCategory>
              {transaction.category}
            </TransactionCategory>
          </TransactionInfo>
          
          <TransactionAmount positive={transaction.amount > 0}>
            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
          </TransactionAmount>
        </TransactionItem>
      ))}
    </TransactionContainer>
  );
};

export default TransactionList;
