import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  width: 100%;
`;

const PokeballSpinner = styled.div<{ size: string }>`
  position: relative;
  width: ${({ size }) => (size === 'small' ? '30px' : size === 'large' ? '70px' : '50px')};
  height: ${({ size }) => (size === 'small' ? '30px' : size === 'large' ? '70px' : '50px')};
  background: linear-gradient(to bottom, #ef5350 0%, #ef5350 50%, white 50%, white 100%);
  border-radius: 50%;
  border: ${({ size }) => (size === 'small' ? '2px' : '3px')} solid #333;
  animation: ${bounce} 0.8s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: calc(50% - 2px);
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #333;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${({ size }) => (size === 'small' ? '10px' : size === 'large' ? '25px' : '15px')};
    height: ${({ size }) => (size === 'small' ? '10px' : size === 'large' ? '25px' : '15px')};
    background-color: white;
    border-radius: 50%;
    border: ${({ size }) => (size === 'small' ? '2px' : '3px')} solid #333;
  }
`;

const LoadingMessage = styled.p`
  margin-top: 16px;
  font-size: 1rem;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium',
  message = 'Loading...'
}) => {
  return (
    <LoadingContainer>
      <PokeballSpinner size={size} />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </LoadingContainer>
  );
};

export default Loading; 