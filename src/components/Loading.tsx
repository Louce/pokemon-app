import React from 'react';

import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  width: 100%;
`;

const LoadingText = styled.p`
  color: var(--text-light);
  margin-top: 24px;
  font-size: 1rem;
  font-weight: 500;
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const Pokeball = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #ff1a1a 0%, #ff1a1a 50%, white 50%, white 100%);
  position: relative;
  animation: ${rotate} 1.5s linear infinite, ${bounce} 0.8s ease-in-out infinite;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 3px;
    background-color: #333;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    border: 3px solid #333;
    z-index: 2;
  }
`;

const Loading: React.FC<{ text?: string }> = ({ text = 'Loading Pokémon data...' }) => {
  return (
    <Container>
      <Pokeball />
      <LoadingText>{text}</LoadingText>
    </Container>
  );
};

export default Loading; 