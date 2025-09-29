import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTarget, FiPlus, FiEdit3, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Auth';

const SavingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const GoalCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};
  
  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    .goal-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
    }
    
    .priority {
      background: ${props => props.priorityColor || '#e2e8f0'};
      color: ${props => props.priorityTextColor || '#4a5568'};
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
  
  .goal-amounts {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .current {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }
    
    .target {
      font-size: 1rem;
      color: #718096;
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
    
    .progress-fill {
      height: 100%;
      background: ${props => props.color || '#667eea'};
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
  
  .progress-text {
    text-align: center;
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 1rem;
  }
  
  .goal-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
`;

const AddGoalCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f8fafc;
  }
  
  .add-icon {
    font-size: 3rem;
    color: #cbd5e0;
    margin-bottom: 1rem;
  }
  
  .add-text {
    color: #718096;
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #5a67d8;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &.edit {
    background: #fef3c7;
    color: #d97706;
    
    &:hover {
      background: #fde68a;
    }
  }
  
  &.delete {
    background: #fee2e2;
    color: #dc2626;
    
    &:hover {
      background: #fecaca;
    }
  }
`;

const getPriorityColor = (priority) => {
  switch (priority) {
    case 1: return { bg: '#fee2e2', text: '#dc2626' };
    case 2: return { bg: '#fef3c7', text: '#d97706' };
    case 3: return { bg: '#dbeafe', text: '#2563eb' };
    case 4: return { bg: '#f3e8ff', text: '#7c3aed' };
    case 5: return { bg: '#e5e7eb', text: '#6b7280' };
    default: return { bg: '#e2e8f0', text: '#4a5568' };
  }
};

const getGoalColor = (index) => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  return colors[index % colors.length];
};

function SavingsGoals() {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    currentAmount: '',
    targetAmount: '',
    priority: 3,
    targetDate: ''
  });

  // Load goals from backend on component mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/savings/goals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const goalsData = await response.json();
          const formattedGoals = goalsData.map(goal => ({
            id: goal.id,
            name: goal.name,
            currentAmount: goal.current_amount,
            targetAmount: goal.target_amount,
            priority: goal.priority,
            targetDate: goal.target_date
          }));
          setGoals(formattedGoals);
        }
      } catch (error) {
        console.error('Error loading goals:', error);
        // Keep empty array if backend is not available
      }
    };
    loadGoals();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const goalData = {
        name: newGoal.name,
        target_amount: parseFloat(newGoal.targetAmount),
        current_amount: parseFloat(newGoal.currentAmount) || 0,
        target_date: newGoal.targetDate,
        priority: newGoal.priority
      };

      const response = await fetch('http://127.0.0.1:8000/api/savings/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
      });

      if (response.ok) {
        const createdGoal = await response.json();
        setGoals([...goals, {
          id: createdGoal.id,
          name: createdGoal.name,
          currentAmount: createdGoal.current_amount,
          targetAmount: createdGoal.target_amount,
          priority: createdGoal.priority,
          targetDate: createdGoal.target_date
        }]);
        setNewGoal({ name: '', currentAmount: '', targetAmount: '', priority: 3, targetDate: '' });
        setShowAddForm(false);
        toast.success('Goal added successfully!');
      } else {
        throw new Error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/savings/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setGoals(goals.filter(goal => goal.id !== id));
        toast.success('Goal deleted');
      } else {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal. Please try again.');
    }
  };

  return (
    <SavingsContainer>
      <Header>
        <h1>
          <FiTarget />
          Savings Goals
        </h1>
        <p>Track and achieve your financial goals</p>
      </Header>

      <GoalsGrid>
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const priorityColors = getPriorityColor(goal.priority);
          const goalColor = getGoalColor(index);
          
          return (
            <GoalCard
              key={goal.id}
              color={goalColor}
              priorityColor={priorityColors.bg}
              priorityTextColor={priorityColors.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="goal-header">
                <div className="goal-name">{goal.name}</div>
                <div className="priority">Priority {goal.priority}</div>
              </div>
              
              <div className="goal-amounts">
                <div className="current">${goal.currentAmount.toLocaleString()}</div>
                <div className="target">of ${goal.targetAmount.toLocaleString()}</div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              
              <div className="progress-text">
                {progress.toFixed(1)}% complete
              </div>
              
              <div className="goal-actions">
                <ActionButton
                  className="edit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEdit3 />
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDeleteGoal(goal.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2 />
                </ActionButton>
              </div>
            </GoalCard>
          );
        })}
        
        <AddGoalCard onClick={() => setShowAddForm(true)}>
          <FiPlus className="add-icon" />
          <div className="add-text">Add New Goal</div>
        </AddGoalCard>
      </GoalsGrid>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Add New Savings Goal</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <FormGroup>
              <label>Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g., Emergency Fund"
              />
            </FormGroup>
            <FormGroup>
              <label>Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({...newGoal, priority: parseInt(e.target.value)})}
              >
                <option value={1}>1 - Critical</option>
                <option value={2}>2 - High</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - Low</option>
                <option value={5}>5 - Optional</option>
              </select>
            </FormGroup>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <FormGroup>
              <label>Current Amount ($)</label>
              <input
                type="number"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                placeholder="0.00"
              />
            </FormGroup>
            <FormGroup>
              <label>Target Amount ($)</label>
              <input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                placeholder="0.00"
              />
            </FormGroup>
          </div>
          
          <FormGroup>
            <label>Target Date</label>
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
            />
          </FormGroup>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowAddForm(false)}
              style={{ background: '#e2e8f0', color: '#4a5568' }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>
              <FiPlus />
              Add Goal
            </Button>
          </div>
        </motion.div>
      )}
    </SavingsContainer>
  );
}

export default SavingsGoals;
