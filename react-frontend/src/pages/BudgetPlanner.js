import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPieChart, FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const BudgetContainer = styled.div`
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

const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

const BudgetItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  
  .category {
    font-weight: 600;
    color: #1a202c;
  }
  
  .amount {
    font-weight: 700;
    color: #667eea;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
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

const BudgetSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  .label {
    color: #718096;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

function BudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, category: 'Housing', amount: 1500, percentage: 30 },
    { id: 2, category: 'Food', amount: 500, percentage: 10 },
    { id: 3, category: 'Transportation', amount: 300, percentage: 6 },
    { id: 4, category: 'Entertainment', amount: 200, percentage: 4 },
    { id: 5, category: 'Savings', amount: 1000, percentage: 20 },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = monthlyIncome - totalBudget;

  const chartData = budgetItems.map(item => ({
    name: item.category,
    value: item.amount,
    color: COLORS[budgetItems.indexOf(item) % COLORS.length]
  }));

  const handleAddItem = () => {
    if (!newCategory || !newAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newItem = {
      id: Date.now(),
      category: newCategory,
      amount: amount,
      percentage: ((amount / monthlyIncome) * 100).toFixed(1)
    };

    setBudgetItems([...budgetItems, newItem]);
    setNewCategory('');
    setNewAmount('');
    toast.success('Budget item added successfully!');
  };

  const handleDeleteItem = (id) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success('Budget item deleted');
  };

  return (
    <BudgetContainer>
      <Header>
        <h1>
          <FiPieChart />
          Budget Planner
        </h1>
        <p>Create and manage your monthly budget</p>
      </Header>

      <BudgetSummary>
        <SummaryCard>
          <div className="value">${monthlyIncome.toLocaleString()}</div>
          <div className="label">Monthly Income</div>
        </SummaryCard>
        <SummaryCard>
          <div className="value">${totalBudget.toLocaleString()}</div>
          <div className="label">Total Budget</div>
        </SummaryCard>
        <SummaryCard>
          <div className="value" style={{ color: remaining >= 0 ? '#10b981' : '#ef4444' }}>
            ${remaining.toLocaleString()}
          </div>
          <div className="label">Remaining</div>
        </SummaryCard>
      </BudgetSummary>

      <BudgetGrid>
        <Card>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Add Budget Item</h3>
          <FormGroup>
            <label>Category</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Groceries, Gas, Utilities"
            />
          </FormGroup>
          <FormGroup>
            <label>Amount ($)</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
            />
          </FormGroup>
          <Button
            onClick={handleAddItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Item
          </Button>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Budget Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </BudgetGrid>

      <Card>
        <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Budget Items</h3>
        {budgetItems.map((item) => (
          <BudgetItem key={item.id}>
            <div>
              <div className="category">{item.category}</div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                {item.percentage}% of income
              </div>
            </div>
            <div className="amount">${item.amount.toLocaleString()}</div>
            <div className="actions">
              <ActionButton
                className="edit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEdit3 />
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDeleteItem(item.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTrash2 />
              </ActionButton>
            </div>
          </BudgetItem>
        ))}
      </Card>
    </BudgetContainer>
  );
}

export default BudgetPlanner;
