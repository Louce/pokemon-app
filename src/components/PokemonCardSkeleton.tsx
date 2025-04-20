import React from 'react';

import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const Card = styled(motion.div)<{ viewMode?: 'grid' | 'list' }>`
  background-color: var(--card-bg-light);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  height: ${props => props.viewMode === 'list' ? '140px' : '280px'};
  display: flex;
  flex-direction: ${props => props.viewMode === 'list' ? 'row' : 'column'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  .dark-mode & {
    background-color: var(--card-bg-dark);
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, 
    rgba(255, 255, 255, 0.1) 8%, 
    rgba(255, 255, 255, 0.2) 18%, 
    rgba(255, 255, 255, 0.1) 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  
  .dark-mode & {
    background: linear-gradient(to right, 
      rgba(70, 70, 80, 0.1) 8%, 
      rgba(70, 70, 80, 0.2) 18%, 
      rgba(70, 70, 80, 0.1) 33%);
  }
`;

const ImageContainer = styled.div<{ viewMode?: 'grid' | 'list' }>`
  background-color: rgba(0, 0, 0, 0.05);
  width: ${props => props.viewMode === 'list' ? '140px' : '100%'};
  height: ${props => props.viewMode === 'list' ? '140px' : '160px'};
  border-radius: ${props => props.viewMode === 'list' ? '16px 0 0 16px' : '16px 16px 0 0'};
  position: relative;
  
  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ContentContainer = styled.div<{ viewMode?: 'grid' | 'list' }>`
  padding: 16px;
  flex: 1;
`;

const IdSkeleton = styled.div`
  width: 40px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
  
  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NameSkeleton = styled.div`
  width: 80%;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 16px;
  
  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TypesSkeleton = styled.div`
  display: flex;
  gap: 8px;
`;

const TypeBadgeSkeleton = styled.div`
  width: 72px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  
  .dark-mode & {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

interface PokemonCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

const PokemonCardSkeleton: React.FC<PokemonCardSkeletonProps> = ({ viewMode = 'grid' }) => {
  return (
    <Card 
      viewMode={viewMode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ShimmerEffect />
      <ImageContainer viewMode={viewMode} />
      <ContentContainer viewMode={viewMode}>
        <IdSkeleton />
        <NameSkeleton />
        <TypesSkeleton>
          <TypeBadgeSkeleton />
          <TypeBadgeSkeleton style={{ width: '60px' }} />
        </TypesSkeleton>
      </ContentContainer>
    </Card>
  );
};

export default PokemonCardSkeleton; 