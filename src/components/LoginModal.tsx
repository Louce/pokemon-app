import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

// Styled components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  
  /* Position modal at the top for mobile */
  @media (max-width: 768px) {
    align-items: flex-start;
    padding-top: 0;
  }
`;

const ModalContainer = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 450px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  .dark-mode & {
    background-color: var(--bg-dark);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: 0 0 12px 12px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 1.5rem;
    border-radius: 0 0 10px 10px;
  }
  
  @media (max-width: 360px) {
    padding: 1.25rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  .dark-mode & {
    color: #aaa;
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  
  .dark-mode & {
    background-color: var(--bg-dark-lighter);
    border-color: #555;
    color: var(--text-dark);
  }
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.95rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(var(--primary-color-rgb), 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
  
  .dark-mode & {
    border-bottom-color: #444;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.active ? 'var(--primary-color)' : '#888'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
  
  .dark-mode & {
    color: ${props => props.active ? 'var(--primary-color)' : '#aaa'};
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.95rem;
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

enum AuthTabState {
  LOGIN = 'login',
  REGISTER = 'register'
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AuthTabState>(AuthTabState.LOGIN);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { loginUser, registerUser } = useUser();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let success = false;
      
      if (activeTab === AuthTabState.LOGIN) {
        success = await loginUser(username, password);
        if (!success) {
          setError('Invalid username or password');
        }
      } else {
        if (!email.includes('@')) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        success = await registerUser(username, email, password);
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }
      
      if (success) {
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Different animation based on mobile or desktop
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? -100 : 50 
    },
    visible: { 
      opacity: 1, 
      y: 0 
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <ModalContainer
            variants={modalVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose} aria-label="Close login modal">
              ×
            </CloseButton>
            
            <Title>{activeTab === AuthTabState.LOGIN ? 'Sign In' : 'Create Account'}</Title>
            
            <TabsContainer>
              <Tab 
                active={activeTab === AuthTabState.LOGIN}
                onClick={() => setActiveTab(AuthTabState.LOGIN)}
              >
                Login
              </Tab>
              <Tab 
                active={activeTab === AuthTabState.REGISTER}
                onClick={() => setActiveTab(AuthTabState.REGISTER)}
              >
                Register
              </Tab>
            </TabsContainer>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </FormGroup>
              
              {activeTab === AuthTabState.REGISTER && (
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </FormGroup>
              )}
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={activeTab === AuthTabState.LOGIN ? 'current-password' : 'new-password'}
                />
              </FormGroup>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <SubmitButton type="submit" disabled={loading}>
                {loading 
                  ? 'Processing...' 
                  : activeTab === AuthTabState.LOGIN ? 'Login' : 'Register'}
              </SubmitButton>
            </Form>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default LoginModal; 