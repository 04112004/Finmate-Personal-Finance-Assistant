import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiTarget, FiShield } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const InvestmentContainer = styled.div`
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

const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1.5rem;
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

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const RecommendationCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};
  
  h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    .label {
      color: #718096;
    }
    
    .value {
      font-weight: 600;
      color: #1a202c;
    }
  }
`;

const AssetAllocationCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1.5rem;
  }
`;

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

function InvestmentAdvisor() {
  const [profile, setProfile] = useState({
    age: 30,
    income: 60000,
    riskTolerance: 'medium',
    timeHorizon: 10,
    goals: ['retirement']
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockRecommendations = {
        riskLevel: profile.riskTolerance,
        expectedReturn: profile.riskTolerance === 'high' ? 12 : profile.riskTolerance === 'medium' ? 8 : 5,
        riskDescription: profile.riskTolerance === 'high' 
          ? 'High risk, high reward strategy focused on growth'
          : profile.riskTolerance === 'medium'
          ? 'Balanced approach with moderate risk and steady growth'
          : 'Conservative strategy prioritizing capital preservation',
        assetAllocation: {
          'Stocks': profile.riskTolerance === 'high' ? 80 : profile.riskTolerance === 'medium' ? 60 : 40,
          'Bonds': profile.riskTolerance === 'high' ? 15 : profile.riskTolerance === 'medium' ? 30 : 50,
          'Cash': profile.riskTolerance === 'high' ? 5 : profile.riskTolerance === 'medium' ? 10 : 10
        },
        recommendedInvestments: [
          {
            name: 'S&P 500 Index Fund',
            type: 'Stock Fund',
            risk: 'Medium',
            expectedReturn: 8
          },
          {
            name: 'Total Bond Market Fund',
            type: 'Bond Fund',
            risk: 'Low',
            expectedReturn: 4
          },
          {
            name: 'High-Yield Savings',
            type: 'Cash',
            risk: 'Very Low',
            expectedReturn: 2
          }
        ]
      };
      
      setRecommendations(mockRecommendations);
      setLoading(false);
      toast.success('Investment recommendations generated!');
    }, 2000);
  };

  const allocationData = recommendations ? Object.entries(recommendations.assetAllocation).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  })) : [];

  return (
    <InvestmentContainer>
      <Header>
        <h1>
          <FiTrendingUp />
          Investment Advisor
        </h1>
        <p>Get personalized investment recommendations</p>
      </Header>

      <ProfileCard>
        <h3>Your Investment Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <FormGroup>
            <label>Age</label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
              min="18"
              max="100"
            />
          </FormGroup>
          <FormGroup>
            <label>Annual Income ($)</label>
            <input
              type="number"
              value={profile.income}
              onChange={(e) => setProfile({...profile, income: parseInt(e.target.value)})}
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <label>Risk Tolerance</label>
            <select
              value={profile.riskTolerance}
              onChange={(e) => setProfile({...profile, riskTolerance: e.target.value})}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Time Horizon (years)</label>
            <input
              type="number"
              value={profile.timeHorizon}
              onChange={(e) => setProfile({...profile, timeHorizon: parseInt(e.target.value)})}
              min="1"
              max="50"
            />
          </FormGroup>
        </div>
        <Button
          onClick={handleGetRecommendations}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiTarget />
          {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </ProfileCard>

      {recommendations && (
        <>
          <RecommendationsGrid>
            <RecommendationCard color="#10b981">
              <h4>Risk Assessment</h4>
              <div className="metric">
                <span className="label">Risk Level:</span>
                <span className="value">{recommendations.riskLevel.toUpperCase()}</span>
              </div>
              <div className="metric">
                <span className="label">Expected Return:</span>
                <span className="value">{recommendations.expectedReturn}%</span>
              </div>
              <p style={{ marginTop: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                {recommendations.riskDescription}
              </p>
            </RecommendationCard>

            <RecommendationCard color="#3b82f6">
              <h4>Investment Strategy</h4>
              <div className="metric">
                <span className="label">Age-based Allocation:</span>
                <span className="value">{100 - profile.age}% Stocks</span>
              </div>
              <div className="metric">
                <span className="label">Time Horizon:</span>
                <span className="value">{profile.timeHorizon} years</span>
              </div>
              <div className="metric">
                <span className="label">Annual Contribution:</span>
                <span className="value">${Math.round(profile.income * 0.15).toLocaleString()}</span>
              </div>
            </RecommendationCard>
          </RecommendationsGrid>

          <AssetAllocationCard>
            <h3>Recommended Asset Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </AssetAllocationCard>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Recommended Investments</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recommendations.recommendedInvestments.map((investment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#1a202c', margin: 0 }}>{investment.name}</h4>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>{investment.expectedReturn}% return</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                    <span>Type: {investment.type}</span>
                    <span>Risk: {investment.risk}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </InvestmentContainer>
  );
}

export default InvestmentAdvisor;
