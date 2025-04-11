import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0;
  flex-wrap: wrap;
  gap: 8px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'var(--card-bg-light)')};
  color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'white' : 'var(--text-light)')};
  border: 1px solid var(--primary-color);
  font-weight: ${({ isActive }: { isActive?: boolean }) => (isActive ? '600' : '400')};
  
  &:hover {
    background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'rgba(239, 83, 80, 0.1)')};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  .dark-mode & {
    background-color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'var(--primary-color)' : 'var(--card-bg-dark)')};
    color: ${({ isActive }: { isActive?: boolean }) => (isActive ? 'white' : 'var(--text-dark)')};
  }
`;

const EllipsisSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

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
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        ◄
      </PageButton>
      
      {getPageNumbers().map((pageNumber, index) => (
        pageNumber === 'ellipsis' ? (
          <EllipsisSpan key={`ellipsis-${index}`}>...</EllipsisSpan>
        ) : (
          <PageButton
            key={pageNumber}
            isActive={pageNumber === currentPage}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </PageButton>
        )
      ))}
      
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        ►
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination; 