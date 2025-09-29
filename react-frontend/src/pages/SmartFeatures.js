import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiZap, FiTarget, FiTrendingUp, FiBookOpen, FiBarChart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SmartContainer = styled.div`
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

const TabsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.active ? '#f7fafc' : 'transparent'};
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.active ? '#667eea' : '#718096'};
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const ResultsContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const ResultsTitle = styled.h3`
  color: #1a202c;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ResultCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const ResultLabel = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const ResultValue = styled.div`
  color: #4a5568;
  font-size: 0.9rem;
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RecommendationItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  ${props => props.priority === 'high' && `
    background: #fed7d7;
    color: #c53030;
  `}
  
  ${props => props.priority === 'medium' && `
    background: #fef5e7;
    color: #d69e2e;
  `}
  
  ${props => props.priority === 'low' && `
    background: #c6f6d5;
    color: #2f855a;
  `}
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }
  
  input, select, textarea {
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

function SmartFeatures() {
  const [activeTab, setActiveTab] = useState('advice');
  const [adviceData, setAdviceData] = useState({
    age: 30,
    income: 60000,
    riskTolerance: 'medium',
    timeHorizon: 10,
    housing: 1500,
    food: 500,
    transportation: 300,
    entertainment: 200,
    other: 300,
    currentSavings: 5000
  });
  const [scenarioData, setScenarioData] = useState({
    annualIncome: 60000,
    currentSavings: 10000,
    savingsRate: 20,
    years: 10,
    returnRate: 7
  });
  const [term, setTerm] = useState('');
  
  // Results state
  const [adviceResults, setAdviceResults] = useState(null);
  const [scenarioResults, setScenarioResults] = useState(null);
  const [termResults, setTermResults] = useState(null);
  const [goalResults, setGoalResults] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const [goalData, setGoalData] = useState({
    goalName: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 2000,
    monthlyContribution: 500,
    expectedReturn: 5
  });

  const handleGetAdvice = async () => {
    try {
      console.log('Calling personalized advice API...');
      const response = await fetch('http://127.0.0.1:8000/api/smart/personalized-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: {
            age: adviceData.age,
            income: adviceData.income,
            risk_tolerance: adviceData.riskTolerance,
            investment_goals: ['retirement', 'emergency_fund', 'wealth_building'],
            time_horizon: adviceData.timeHorizon
          },
          spending_habits: {
            housing: adviceData.housing,
            food: adviceData.food,
            transportation: adviceData.transportation,
            entertainment: adviceData.entertainment,
            other: adviceData.other
          },
          current_savings: adviceData.currentSavings
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Personalized advice response:', data);
        setAdviceResults(data);
        toast.success('Personalized advice generated! Check the results below.');
      } else {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error('Failed to get personalized advice');
      }
    } catch (error) {
      console.error('Error getting personalized advice:', error);
      toast.error('Failed to get personalized advice. Please try again.');
    }
  };

  const handleSimulateScenario = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/smart/scenario-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario_type: 'savings_rate',
          parameters: {
            annual_income: scenarioData.annualIncome,
            current_savings: scenarioData.currentSavings,
            savings_rate: scenarioData.savingsRate,
            years: scenarioData.years,
            return_rate: scenarioData.returnRate
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setScenarioResults(data);
        toast.success(`Scenario simulation complete! Future value: $${data.future_value?.toLocaleString() || 'Calculated'}`);
      } else {
        throw new Error('Failed to simulate scenario');
      }
    } catch (error) {
      console.error('Error simulating scenario:', error);
      toast.error('Failed to simulate scenario. Please try again.');
    }
  };

  const handleExplainTerm = async () => {
    if (!term.trim()) {
      toast.error('Please enter a financial term');
      return;
    }
    
    try {
      console.log('Calling explain term API for:', term);
      const response = await fetch(`http://127.0.0.1:8000/api/smart/explain-term/${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Term explanation response:', data);
        setTermResults(data);
        if (data.found) {
          toast.success(`Explanation for "${term}" generated!`);
        } else {
          toast.warning(`Term "${term}" not found. Try a different financial term.`);
        }
      } else {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error('Failed to get term explanation');
      }
    } catch (error) {
      console.error('Error explaining term:', error);
      toast.error('Failed to get term explanation. Please try again.');
    }
  };

  const handlePredictGoal = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/smart/goal-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_name: goalData.goalName,
          target_amount: goalData.targetAmount,
          current_amount: goalData.currentAmount,
          monthly_contribution: goalData.monthlyContribution,
          expected_return: goalData.expectedReturn
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGoalResults(data);
        if (data.achievable) {
          toast.success(`Goal prediction complete! ${data.years_to_goal?.toFixed(1) || 'Calculated'} years to achieve goal.`);
        } else {
          toast.warning(`Goal may not be achievable with current parameters. ${data.message || 'Consider adjusting your contribution or timeline.'}`);
        }
      } else {
        throw new Error('Failed to predict goal');
      }
    } catch (error) {
      console.error('Error predicting goal:', error);
      toast.error('Failed to predict goal. Please try again.');
    }
  };

  const handleSmartAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/smart/smart-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_profile: {
            age: adviceData.age,
            income: adviceData.income,
            risk_tolerance: adviceData.riskTolerance,
            investment_goals: ['retirement', 'emergency_fund', 'wealth_building'],
            time_horizon: adviceData.timeHorizon
          },
          spending_data: [
            { category: 'housing', amount: adviceData.housing },
            { category: 'food', amount: adviceData.food },
            { category: 'transportation', amount: adviceData.transportation },
            { category: 'entertainment', amount: adviceData.entertainment },
            { category: 'other', amount: adviceData.other }
          ],
          savings_goals: [
            { name: goalData.goalName, target_amount: goalData.targetAmount, current_amount: goalData.currentAmount }
          ]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data);
        toast.success('Smart analysis complete! Check the results below.');
      } else {
        throw new Error('Failed to run smart analysis');
      }
    } catch (error) {
      console.error('Error running smart analysis:', error);
      toast.error('Failed to run smart analysis. Please try again.');
    }
  };

  const tabs = [
    { id: 'advice', label: 'Personalized Advice', icon: FiZap },
    { id: 'scenario', label: 'Scenario Simulation', icon: FiTrendingUp },
    { id: 'terms', label: 'Terminology', icon: FiBookOpen },
    { id: 'goals', label: 'Goal Predictor', icon: FiTarget },
    { id: 'analysis', label: 'Smart Analysis', icon: FiBarChart }
  ];

  return (
    <SmartContainer>
      <Header>
        <h1>
          <FiZap />
          Smart AI Features
        </h1>
        <p>Advanced AI-powered financial tools and insights</p>
      </Header>

      <TabsContainer>
        <TabsHeader>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon style={{ marginRight: '0.5rem' }} />
                {tab.label}
              </Tab>
            );
          })}
        </TabsHeader>

        <TabContent>
          {activeTab === 'advice' && (
            <Card>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Personalized Financial Advice</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <FormGroup>
                  <label>Age</label>
                  <input
                    type="number"
                    value={adviceData.age}
                    onChange={(e) => setAdviceData({...adviceData, age: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Annual Income ($)</label>
                  <input
                    type="number"
                    value={adviceData.income}
                    onChange={(e) => setAdviceData({...adviceData, income: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Risk Tolerance</label>
                  <select
                    value={adviceData.riskTolerance}
                    onChange={(e) => setAdviceData({...adviceData, riskTolerance: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Time Horizon (years)</label>
                  <input
                    type="number"
                    value={adviceData.timeHorizon}
                    onChange={(e) => setAdviceData({...adviceData, timeHorizon: parseInt(e.target.value)})}
                  />
                </FormGroup>
              </div>
              <Button onClick={handleGetAdvice} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiZap />
                Get Personalized Advice
              </Button>
            </Card>
          )}
          
          {activeTab === 'advice' && adviceResults && (
            <ResultsContainer>
              <ResultsTitle>🎯 Personalized Financial Advice</ResultsTitle>
              
              {adviceResults.personalized_recommendations && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Recommendations</h4>
                  <RecommendationList>
                    {adviceResults.personalized_recommendations.map((rec, index) => (
                      <RecommendationItem key={index}>
                        <strong>{rec.category}:</strong> {rec.advice}
                        <PriorityBadge priority={rec.priority}>{rec.priority.toUpperCase()}</PriorityBadge>
                      </RecommendationItem>
                    ))}
                  </RecommendationList>
                </div>
              )}
              
              {adviceResults.risk_assessment && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Risk Assessment</h4>
                  <ResultsGrid>
                    <ResultCard>
                      <ResultLabel>Risk Level</ResultLabel>
                      <ResultValue>{adviceResults.risk_assessment.risk_level}</ResultValue>
                    </ResultCard>
                    <ResultCard>
                      <ResultLabel>Risk Score</ResultLabel>
                      <ResultValue>{adviceResults.risk_assessment.risk_score}/10</ResultValue>
                    </ResultCard>
                  </ResultsGrid>
                  {adviceResults.risk_assessment.risk_factors && adviceResults.risk_assessment.risk_factors.length > 0 && (
                    <div>
                      <strong>Risk Factors:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        {adviceResults.risk_assessment.risk_factors.map((factor, index) => (
                          <li key={index} style={{ color: '#e53e3e' }}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {adviceResults.priority_actions && adviceResults.priority_actions.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Priority Actions</h4>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {adviceResults.priority_actions.map((action, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {adviceResults.long_term_strategy && (
                <div>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Long-term Strategy</h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{adviceResults.long_term_strategy}</p>
                </div>
              )}
            </ResultsContainer>
          )}

          {activeTab === 'scenario' && (
            <Card>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Scenario Simulation</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <FormGroup>
                  <label>Annual Income ($)</label>
                  <input
                    type="number"
                    value={scenarioData.annualIncome}
                    onChange={(e) => setScenarioData({...scenarioData, annualIncome: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Current Savings ($)</label>
                  <input
                    type="number"
                    value={scenarioData.currentSavings}
                    onChange={(e) => setScenarioData({...scenarioData, currentSavings: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Savings Rate (%)</label>
                  <input
                    type="number"
                    value={scenarioData.savingsRate}
                    onChange={(e) => setScenarioData({...scenarioData, savingsRate: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Years to Simulate</label>
                  <input
                    type="number"
                    value={scenarioData.years}
                    onChange={(e) => setScenarioData({...scenarioData, years: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Expected Return (%)</label>
                  <input
                    type="number"
                    value={scenarioData.returnRate}
                    onChange={(e) => setScenarioData({...scenarioData, returnRate: parseInt(e.target.value)})}
                  />
                </FormGroup>
              </div>
              <Button onClick={handleSimulateScenario} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiTrendingUp />
                Simulate Scenario
              </Button>
            </Card>
          )}
          
          {activeTab === 'scenario' && scenarioResults && (
            <ResultsContainer>
              <ResultsTitle>📊 Scenario Simulation Results</ResultsTitle>
              
              <ResultsGrid>
                <ResultCard>
                  <ResultLabel>Scenario</ResultLabel>
                  <ResultValue>{scenarioResults.scenario}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Future Value</ResultLabel>
                  <ResultValue>${scenarioResults.future_value?.toLocaleString()}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Total Contributions</ResultLabel>
                  <ResultValue>${scenarioResults.total_contributions?.toLocaleString()}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Growth Amount</ResultLabel>
                  <ResultValue>${scenarioResults.growth_amount?.toLocaleString()}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Years</ResultLabel>
                  <ResultValue>{scenarioResults.years}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Return Rate</ResultLabel>
                  <ResultValue>{scenarioResults.return_rate}%</ResultValue>
                </ResultCard>
              </ResultsGrid>
              
              {scenarioResults.scenarios && (
                <div>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Investment Scenarios</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {scenarioResults.scenarios.map((scenario, index) => (
                      <ResultCard key={index}>
                        <ResultLabel>Return Rate: {scenario.return_rate}%</ResultLabel>
                        <ResultValue>
                          <div>Future Value: ${scenario.future_value?.toLocaleString()}</div>
                          <div>Growth: ${scenario.growth?.toLocaleString()}</div>
                        </ResultValue>
                      </ResultCard>
                    ))}
                  </div>
                </div>
              )}
            </ResultsContainer>
          )}

          {activeTab === 'terms' && (
            <Card>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Financial Terminology Explainer</h3>
              <FormGroup>
                <label>Enter a financial term</label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., ETF, 401k, compound interest"
                />
              </FormGroup>
              <Button onClick={handleExplainTerm} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiBookOpen />
                Explain Term
              </Button>
            </Card>
          )}
          
          {activeTab === 'terms' && termResults && (
            <ResultsContainer>
              <ResultsTitle>📚 Financial Term Explanation</ResultsTitle>
              
              <ResultCard>
                <ResultLabel>Term</ResultLabel>
                <ResultValue style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                  {termResults.term}
                </ResultValue>
              </ResultCard>
              
              <ResultCard>
                <ResultLabel>Definition</ResultLabel>
                <ResultValue style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                  {termResults.definition}
                </ResultValue>
              </ResultCard>
              
              {termResults.similar_terms && termResults.similar_terms.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Similar Terms</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {termResults.similar_terms.map((similarTerm, index) => (
                      <span 
                        key={index}
                        style={{
                          background: '#e2e8f0',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          color: '#4a5568'
                        }}
                      >
                        {similarTerm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </ResultsContainer>
          )}

          {activeTab === 'goals' && (
            <Card>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Goal Achievement Predictor</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <FormGroup>
                  <label>Goal Name</label>
                  <input
                    type="text"
                    value={goalData.goalName}
                    onChange={(e) => setGoalData({...goalData, goalName: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Target Amount ($)</label>
                  <input
                    type="number"
                    value={goalData.targetAmount}
                    onChange={(e) => setGoalData({...goalData, targetAmount: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Current Amount ($)</label>
                  <input
                    type="number"
                    value={goalData.currentAmount}
                    onChange={(e) => setGoalData({...goalData, currentAmount: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Monthly Contribution ($)</label>
                  <input
                    type="number"
                    value={goalData.monthlyContribution}
                    onChange={(e) => setGoalData({...goalData, monthlyContribution: parseInt(e.target.value)})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Expected Return (%)</label>
                  <input
                    type="number"
                    value={goalData.expectedReturn}
                    onChange={(e) => setGoalData({...goalData, expectedReturn: parseInt(e.target.value)})}
                  />
                </FormGroup>
              </div>
              <Button onClick={handlePredictGoal} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiTarget />
                Predict Goal Achievement
              </Button>
            </Card>
          )}
          
          {activeTab === 'goals' && goalResults && (
            <ResultsContainer>
              <ResultsTitle>🎯 Goal Achievement Prediction</ResultsTitle>
              
              <ResultsGrid>
                <ResultCard>
                  <ResultLabel>Goal Achievable</ResultLabel>
                  <ResultValue style={{ 
                    color: goalResults.achievable ? '#2f855a' : '#e53e3e',
                    fontWeight: '600'
                  }}>
                    {goalResults.achievable ? '✅ Yes' : '❌ No'}
                  </ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Time to Goal</ResultLabel>
                  <ResultValue>{goalResults.years_to_goal} years</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Monthly Contribution</ResultLabel>
                  <ResultValue>${goalResults.monthly_contribution?.toLocaleString()}</ResultValue>
                </ResultCard>
                <ResultCard>
                  <ResultLabel>Expected Return</ResultLabel>
                  <ResultValue>{goalResults.expected_return}%</ResultValue>
                </ResultCard>
              </ResultsGrid>
              
              <ResultCard style={{ marginTop: '1rem' }}>
                <ResultLabel>Prediction Details</ResultLabel>
                <ResultValue style={{ lineHeight: '1.6' }}>
                  {goalResults.message}
                </ResultValue>
              </ResultCard>
            </ResultsContainer>
          )}

          {activeTab === 'analysis' && (
            <Card>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Comprehensive Smart Analysis</h3>
              <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                Get a complete AI-powered analysis of your financial situation
              </p>
              <Button onClick={handleSmartAnalysis} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FiBarChart />
                Run Smart Analysis
              </Button>
            </Card>
          )}
          
          {activeTab === 'analysis' && analysisResults && (
            <ResultsContainer>
              <ResultsTitle>🧠 Comprehensive Smart Analysis</ResultsTitle>
              
              <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
                <p>Your comprehensive financial analysis has been completed! This analysis combines all your financial data to provide personalized insights and recommendations.</p>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}>Analysis Summary</h4>
                  <p>Based on your profile, spending habits, and financial goals, the AI has generated a comprehensive analysis that includes:</p>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Personalized financial recommendations</li>
                    <li>Risk assessment and mitigation strategies</li>
                    <li>Priority actions for financial improvement</li>
                    <li>Long-term wealth building strategy</li>
                    <li>Goal achievement timeline predictions</li>
                  </ul>
                </div>
                
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fff4', borderRadius: '8px', border: '1px solid #9ae6b4' }}>
                  <strong style={{ color: '#2f855a' }}>💡 Pro Tip:</strong> Review the detailed results in each tab above to get specific insights for different aspects of your financial life.
                </div>
              </div>
            </ResultsContainer>
          )}
        </TabContent>
      </TabsContainer>
    </SmartContainer>
  );
}

export default SmartFeatures;
