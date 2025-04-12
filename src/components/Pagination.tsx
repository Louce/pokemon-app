import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
  flex-wrap: wrap;
  gap: 10px;
`;

const PageButton = styled(motion.button)<{ isActive?: boolean }>`
  min-width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'var(--card-bg-light)')};
  color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'white' : 'var(--text-light)')};
  border: 2px solid ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'transparent')};
  font-weight: ${({ isActive }: { isActive?: boolean }) => (isActive ? '700' : '500')};
  font-size: 1rem;
  box-shadow: ${({ isActive }: { isActive?: boolean }) => (isActive ? '0 6px 12px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(0, 0, 0, 0.05)')};
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: ${({ isActive }: { isActive?: boolean }) => (isActive ? '1' : '0')};
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--accent-color)' : 'rgba(79, 193, 166, 0.1)')};
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--accent-color)' : 'var(--primary-color)')};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .dark-mode & {
    background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--accent-color)' : 'var(--card-bg-dark)')};
    color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'white' : 'var(--text-dark)')};
    box-shadow: ${({ isActive }: { isActive?: boolean }) => (isActive ? '0 6px 16px rgba(0, 0, 0, 0.25)' : '0 4px 8px rgba(0, 0, 0, 0.15)')};
    
    &:hover {
      background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'rgba(79, 193, 166, 0.15)')};
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }
`;

const EllipsisSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  color: var(--text-light);
  font-weight: 600;
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const NavigationButton = styled(PageButton)`
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  .dark-mode & {
    border-color: var(--accent-color);
    color: var(--accent-color);
    
    &:hover {
      background-color: var(--accent-color);
      color: white;
    }
  }
`;

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Handle edge cases
  if (totalPages <= 1) return null;
  
  // Display 5 page numbers max, with ellipsis if needed
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Somewhere in the middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <NavigationButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        aria-label="Previous page"
      >
        ◄
      </NavigationButton>
      
      {getPageNumbers().map((pageNumber, index) => (
        pageNumber === 'ellipsis' ? (
          <EllipsisSpan key={`ellipsis-${index}`}>...</EllipsisSpan>
        ) : (
          <PageButton
            key={pageNumber}
            isActive={pageNumber === currentPage}
            onClick={() => onPageChange(pageNumber as number)}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            animate={pageNumber === currentPage ? { scale: 1.05 } : { scale: 1 }}
          >
            {pageNumber}
          </PageButton>
        )
      ))}
      
      <NavigationButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        aria-label="Next page"
      >
        ►
      </NavigationButton>
    </PaginationContainer>
  );
};

export default Pagination; 