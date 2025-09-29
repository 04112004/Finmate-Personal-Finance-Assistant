import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const SupportContainer = styled(motion.div)`
  padding: 1rem;
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.colors.gray50};
`;

const FormContainer = styled(motion.div)`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.lg};
  margin-bottom: 1rem;
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.gray800};
  margin-bottom: 1rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.gray700};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const FileUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.gray300};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.gray50};
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.gradients.success};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(86, 171, 47, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(86, 171, 47, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Support = ({ onPageChange }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('✅ Application submitted successfully!');
      toast.success('📧 Confirmation email sent!');
      
      // Reset form
      setUploadedFiles([]);
      
    } catch (error) {
      toast.error('❌ Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`📎 ${files.length} file(s) uploaded`);
  };

  return (
    <SupportContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FormContainer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FormTitle>📝 Apply for Financial Support</FormTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <FormGroup>
            <Label>Personal Information</Label>
            <TwoColumn>
              <div>
                <Input
                  type="text"
                  placeholder="First Name"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.firstName.message}</span>}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Last Name"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.lastName.message}</span>}
              </div>
            </TwoColumn>
          </FormGroup>

          <FormGroup>
            <Input
              type="email"
              placeholder="Email Address"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.email.message}</span>}
          </FormGroup>

          <FormGroup>
            <Input
              type="tel"
              placeholder="Phone Number"
              {...register('phone', { required: 'Phone number is required' })}
            />
            {errors.phone && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.phone.message}</span>}
          </FormGroup>

          {/* Support Request Details */}
          <FormGroup>
            <Label>Support Request Details</Label>
            <Select {...register('supportType', { required: 'Support type is required' })}>
              <option value="">Select Support Type</option>
              <option value="emergency">Emergency Assistance</option>
              <option value="rent">Rent Support</option>
              <option value="food">Food Assistance</option>
              <option value="medical">Medical Bills</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </Select>
            {errors.supportType && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.supportType.message}</span>}
          </FormGroup>

          <FormGroup>
            <Input
              type="number"
              placeholder="Amount Requested ($)"
              min="50"
              max="5000"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 50, message: 'Minimum amount is $50' },
                max: { value: 5000, message: 'Maximum amount is $5000' }
              })}
            />
            {errors.amount && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.amount.message}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Urgency Level</Label>
            <Select {...register('urgency', { required: 'Urgency level is required' })}>
              <option value="">Select Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
            {errors.urgency && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.urgency.message}</span>}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              placeholder="Please describe your situation and how financial assistance will help you..."
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 50, message: 'Please provide at least 50 characters' }
              })}
            />
            {errors.description && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.description.message}</span>}
          </FormGroup>

          {/* File Upload */}
          <FormGroup>
            <Label>Supporting Documents (Optional)</Label>
            <FileUpload>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                📎 Click to upload files
              </label>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                PDF, JPG, PNG, DOC, DOCX files accepted
              </p>
            </FileUpload>
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Uploaded Files:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} style={{ 
                    fontSize: '0.8rem', 
                    color: '#64748b',
                    padding: '0.2rem 0'
                  }}>
                    📄 {file.name}
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? '⏳ Submitting...' : '📤 Submit Application'}
          </SubmitButton>
        </form>
      </FormContainer>
    </SupportContainer>
  );
};

export default Support;
