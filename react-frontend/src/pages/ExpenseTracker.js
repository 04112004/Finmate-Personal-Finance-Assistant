import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCreditCard, FiPlus, FiEdit3, FiTrash2, FiTrendingDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Auth';

const ExpenseContainer = styled.div`
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

const SummaryGrid = styled.div`
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
    color: ${props => props.color || '#1a202c'};
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

const ExpenseGrid = styled.div`
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

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  
  .expense-info {
    flex: 1;
    
    .description {
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }
    
    .category {
      font-size: 0.875rem;
      color: #718096;
      text-transform: capitalize;
    }
  }
  
  .amount {
    font-weight: 700;
    color: #ef4444;
    margin-right: 1rem;
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

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

function ExpenseTracker() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  // Load expenses from backend on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/expenses/expenses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const expensesData = await response.json();
          const formattedExpenses = expensesData.map(expense => ({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date
          }));
          setExpenses(formattedExpenses);
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
        // Keep empty array if backend is not available
      }
    };
    loadExpenses();
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: COLORS[index % COLORS.length]
  }));

  const barChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: amount
  }));

  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const expenseData = {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date
      };

      const response = await fetch('http://127.0.0.1:8000/api/expenses/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });

      if (response.ok) {
        const createdExpense = await response.json();
        setExpenses([...expenses, {
          id: createdExpense.id,
          description: createdExpense.description,
          amount: createdExpense.amount,
          category: createdExpense.category,
          date: createdExpense.date
        }]);
        setNewExpense({
          description: '',
          amount: '',
          category: 'food',
          date: new Date().toISOString().split('T')[0]
        });
        toast.success('Expense added successfully!');
      } else {
        throw new Error('Failed to create expense');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/expenses/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setExpenses(expenses.filter(expense => expense.id !== id));
        toast.success('Expense deleted');
      } else {
        throw new Error('Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense. Please try again.');
    }
  };

  return (
    <ExpenseContainer>
      <Header>
        <h1>
          <FiCreditCard />
          Expense Tracker
        </h1>
        <p>Track and analyze your spending</p>
      </Header>

      <SummaryGrid>
        <SummaryCard color="#ef4444">
          <div className="value">${totalExpenses.toLocaleString()}</div>
          <div className="label">Total Expenses</div>
        </SummaryCard>
        <SummaryCard color="#10b981">
          <div className="value">{expenses.length}</div>
          <div className="label">Transactions</div>
        </SummaryCard>
        <SummaryCard color="#f59e0b">
          <div className="value">${(totalExpenses / expenses.length).toFixed(0)}</div>
          <div className="label">Average</div>
        </SummaryCard>
        <SummaryCard color="#3b82f6">
          <div className="value">{Object.keys(expensesByCategory).length}</div>
          <div className="label">Categories</div>
        </SummaryCard>
      </SummaryGrid>

      <ExpenseGrid>
        <Card>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Add Expense</h3>
          <FormGroup>
            <label>Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              placeholder="e.g., Grocery Shopping"
            />
          </FormGroup>
          <FormGroup>
            <label>Amount ($)</label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              placeholder="0.00"
            />
          </FormGroup>
          <FormGroup>
            <label>Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            >
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="healthcare">Healthcare</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Date</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
            />
          </FormGroup>
          <Button
            onClick={handleAddExpense}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Expense
          </Button>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Spending by Category</h3>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </ExpenseGrid>

      <Card>
        <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Recent Expenses</h3>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            No expenses yet. Add your first expense above!
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseItem key={expense.id}>
              <div className="expense-info">
                <div className="description">{expense.description}</div>
                <div className="category">{expense.category}</div>
              </div>
              <div className="amount">-${expense.amount.toLocaleString()}</div>
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
                  onClick={() => handleDeleteExpense(expense.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2 />
                </ActionButton>
              </div>
            </ExpenseItem>
          ))
        )}
      </Card>
    </ExpenseContainer>
  );
}

export default ExpenseTracker;
