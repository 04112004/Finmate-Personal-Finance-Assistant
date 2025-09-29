import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiTarget, 
  FiCreditCard,
  FiDownload,
  FiPlus,
  FiZap,
  FiBarChart
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};
  
  .metric-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    
    .icon {
      color: ${props => props.color || '#667eea'};
      font-size: 1.5rem;
    }
    
    h3 {
      color: #718096;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  .metric-change {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: ${props => props.changeColor || '#10b981'};
    
    &.negative {
      color: #ef4444;
    }
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 1.5rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
  
  .icon {
    font-size: 2rem;
    color: #667eea;
  }
  
  span {
    font-weight: 600;
    color: #1a202c;
  }
`;

const RecentActivity = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 1.5rem;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7fafc;
    color: #667eea;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }
    
    .activity-time {
      font-size: 0.875rem;
      color: #718096;
    }
  }
  
  .activity-amount {
    font-weight: 600;
    color: ${props => props.positive ? '#10b981' : '#ef4444'};
  }
`;

// Sample data
const sampleMetrics = {
  netWorth: 125000,
  savingsRate: 23.5,
  goalsAchieved: 3,
  creditScore: 750
};

const sampleChartData = [
  { month: 'Jan', netWorth: 100000, savings: 15000, investments: 25000 },
  { month: 'Feb', netWorth: 105000, savings: 18000, investments: 27000 },
  { month: 'Mar', netWorth: 110000, savings: 20000, investments: 29000 },
  { month: 'Apr', netWorth: 115000, savings: 22000, investments: 31000 },
  { month: 'May', netWorth: 120000, savings: 24000, investments: 33000 },
  { month: 'Jun', netWorth: 125000, savings: 26000, investments: 35000 },
];

const sampleSpendingData = [
  { name: 'Housing', value: 1500, color: '#667eea' },
  { name: 'Food', value: 500, color: '#764ba2' },
  { name: 'Transportation', value: 300, color: '#f093fb' },
  { name: 'Entertainment', value: 200, color: '#f5576c' },
  { name: 'Other', value: 300, color: '#4facfe' },
];

const sampleActivity = [
  { title: 'Salary Deposit', time: '2 hours ago', amount: 5000, positive: true },
  { title: 'Grocery Shopping', time: '1 day ago', amount: -150, positive: false },
  { title: 'Investment Return', time: '3 days ago', amount: 250, positive: true },
  { title: 'Utility Bill', time: '1 week ago', amount: -120, positive: false },
];

function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(sampleMetrics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch data from your API here
    // fetchDashboardData();
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'Report Generation':
        handleGenerateReport();
        break;
      case 'Goal Creation':
        navigate('/savings');
        break;
      case 'AI Consultation':
        navigate('/ai-coach');
        break;
      case 'Portfolio Review':
        navigate('/investments');
        break;
      default:
        toast.success(`${action} feature coming soon!`);
    }
  };

  const handleGenerateReport = () => {
    // Create a simple financial report
    const reportData = {
      "Financial Summary": {
        "Net Worth": `$${metrics.netWorth.toLocaleString()}`,
        "Savings Rate": `${metrics.savingsRate}%`,
        "Goals Achieved": `${metrics.goalsAchieved}/5`,
        "Credit Score": metrics.creditScore
      }
    };
    
    // Create CSV content
    let csvContent = "Category,Metric,Value\n";
    for (const [category, data] of Object.entries(reportData)) {
      csvContent += `${category},,,\n`;
      for (const [metric, value] of Object.entries(data)) {
        csvContent += `,${metric},${value}\n`;
      }
    }
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Financial report downloaded successfully!');
  };

  const quickActions = [
    { icon: FiDownload, label: 'Generate Report', action: 'Report Generation' },
    { icon: FiPlus, label: 'New Goal', action: 'Goal Creation' },
    { icon: FiZap, label: 'AI Advice', action: 'AI Consultation' },
    { icon: FiBarChart, label: 'Portfolio', action: 'Portfolio Review' },
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Financial Dashboard</h1>
        <p>Welcome back! Here's your financial overview.</p>
      </Header>

      <MetricsGrid>
        <MetricCard
          color="#10b981"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="metric-header">
            <FiDollarSign className="icon" />
            <h3>Total Net Worth</h3>
          </div>
          <div className="metric-value">${metrics.netWorth.toLocaleString()}</div>
          <div className="metric-change">
            <FiTrendingUp />
            +5.2% from last month
          </div>
        </MetricCard>

        <MetricCard
          color="#3b82f6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="metric-header">
            <FiTrendingUp className="icon" />
            <h3>Savings Rate</h3>
          </div>
          <div className="metric-value">{metrics.savingsRate}%</div>
          <div className="metric-change">
            <FiTrendingUp />
            +2.1% improvement
          </div>
        </MetricCard>

        <MetricCard
          color="#8b5cf6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="metric-header">
            <FiTarget className="icon" />
            <h3>Goals Achieved</h3>
          </div>
          <div className="metric-value">{metrics.goalsAchieved}/5</div>
          <div className="metric-change">
            <FiTrendingUp />
            +1 this month
          </div>
        </MetricCard>

        <MetricCard
          color="#f59e0b"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="metric-header">
            <FiCreditCard className="icon" />
            <h3>Credit Score</h3>
          </div>
          <div className="metric-value">{metrics.creditScore}</div>
          <div className="metric-change">
            <FiTrendingUp />
            +15 points
          </div>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <h3>Financial Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="netWorth" stroke="#667eea" strokeWidth={3} />
              <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="investments" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sampleSpendingData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sampleSpendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <QuickActions>
        {quickActions.map((action, index) => (
          <ActionButton
            key={action.label}
            onClick={() => handleQuickAction(action.action)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <action.icon className="icon" />
            <span>{action.label}</span>
          </ActionButton>
        ))}
      </QuickActions>

      <RecentActivity>
        <h3>Recent Activity</h3>
        {sampleActivity.map((activity, index) => (
          <ActivityItem key={index} positive={activity.positive}>
            <div className="activity-icon">
              <FiDollarSign />
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-time">{activity.time}</div>
            </div>
            <div className="activity-amount">
              {activity.positive ? '+' : ''}${Math.abs(activity.amount).toLocaleString()}
            </div>
          </ActivityItem>
        ))}
      </RecentActivity>
    </DashboardContainer>
  );
}

export default Dashboard;
