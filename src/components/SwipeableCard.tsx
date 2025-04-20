import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
  className?: string;
}

// Define our own PanInfo interface
interface PanInfo {
  point: {
    x: number;
    y: number;
  };
  delta: {
    x: number;
    y: number;
  };
  offset: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
}

const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const ActionIndicator = styled.div<{ position: 'left' | 'right'; isVisible: boolean; color: string }>`
  position: absolute;
  top: 50%;
  ${props => props.position === 'left' ? 'left: 16px;' : 'right: 16px;'}
  transform: translateY(-50%);
  color: ${props => props.color};
  font-size: 20px;
  opacity: ${props => props.isVisible ? 0.8 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 100,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { darkMode } = useTheme();
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    setDirection(null);
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && onSwipeRight) {
        setTimeout(onSwipeRight, 300);
      } else if (info.offset.x < 0 && onSwipeLeft) {
        setTimeout(onSwipeLeft, 300);
      }
    }
  };
  
  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 20) {
      setDirection('right');
    } else if (info.offset.x < -20) {
      setDirection('left');
    } else {
      setDirection(null);
    }
  };
  
  return (
    <CardContainer 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      className={className}
    >
      <ActionIndicator 
        position="left" 
        isVisible={direction === 'right'} 
        color={darkMode ? "#f44336" : "#d32f2f"}
      >
        ❤️
      </ActionIndicator>
      <ActionIndicator 
        position="right" 
        isVisible={direction === 'left'} 
        color={darkMode ? "#2196f3" : "#1976d2"}
      >
        ℹ️
      </ActionIndicator>
      {children}
    </CardContainer>
  );
};

export default SwipeableCard; 