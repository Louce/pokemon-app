import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import { useFilters, FilterOptions } from '../contexts/FilterContext';

// Styled components
const FiltersContainer = styled(motion.div)`
  background-color: var(--card-bg-light);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 25px;
  margin-bottom: 30px;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(var(--primary-color-rgb), 0.1);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  }
  
  .dark-mode & {
    background-color: var(--card-bg-dark);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.05);
    
    &::before {
      background: linear-gradient(to right, var(--accent-color), var(--primary-color));
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  .dark-mode & {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
`;

const FiltersTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-light);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--primary-color);
  }
  
  .dark-mode & {
    color: var(--text-dark);
    
    svg {
      color: var(--accent-color);
    }
  }
`;

const FilterCount = styled.span`
  background-color: var(--primary-color);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const ResetButton = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--primary-color);
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .dark-mode & {
    color: var(--secondary-color);
    
    &:hover {
      background-color: rgba(var(--secondary-color-rgb), 0.1);
    }
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  font-size: 0.95rem;
  color: var(--text-light);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
  
  .dark-mode & {
    background-color: var(--bg-dark-lighter);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--text-dark);
  }
`;

const RangeInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  font-size: 0.95rem;
  color: var(--text-light);
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
  
  .dark-mode & {
    background-color: var(--bg-dark-lighter);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--text-dark);
  }
  
  &::placeholder {
    color: rgba(var(--text-light-rgb), 0.5);
    
    .dark-mode & {
      color: rgba(var(--text-dark-rgb), 0.5);
    }
  }
`;

const NumberRangeContainer = styled.div`
  display: flex;
  gap: 10px;
`;

// New styling for type buttons section
const TypesContainer = styled.div`
  grid-column: 1 / -1;
  margin-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
  
  .dark-mode & {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
`;

const TypesTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const TypeButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const TypeButton = styled.button<{ active: boolean; type: string }>`
  padding: 8px 12px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: ${({ active, type }) =>
    active ? `var(--type-${type})` : 'var(--card-bg-light)'};
  color: ${({ active }) => 
    active ? '#fff' : 'var(--text-light)'};
  border: 2px solid ${({ active, type }) =>
    active ? `var(--type-${type})` : 'transparent'};
  
  .dark-mode & {
    background-color: ${({ active, type }) =>
      active ? `var(--type-${type})` : 'var(--card-bg-dark)'};
    color: ${({ active }) => 
      active ? '#fff' : 'var(--text-dark)'};
    border: 2px solid ${({ active, type }) =>
      active ? `var(--type-${type})` : 'transparent'};
  }
  
  &:hover {
    transform: translateY(-2px);
    color: ${({ active }) => (active ? '#fff' : 'var(--primary-color)')};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .dark-mode & {
      color: ${({ active }) => (active ? '#fff' : 'rgba(235, 235, 240, 0.9)')};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
`;

// Pokemon abilities preset for the select
const COMMON_ABILITIES = [
  { value: '', label: 'Any Ability' },
  { value: 'overgrow', label: 'Overgrow' },
  { value: 'chlorophyll', label: 'Chlorophyll' },
  { value: 'blaze', label: 'Blaze' },
  { value: 'solar-power', label: 'Solar Power' },
  { value: 'torrent', label: 'Torrent' },
  { value: 'rain-dish', label: 'Rain Dish' },
  { value: 'shield-dust', label: 'Shield Dust' },
  { value: 'levitate', label: 'Levitate' },
  { value: 'intimidate', label: 'Intimidate' },
  { value: 'static', label: 'Static' },
  { value: 'thick-fat', label: 'Thick Fat' },
  { value: 'guts', label: 'Guts' },
  { value: 'sand-veil', label: 'Sand Veil' },
  { value: 'swift-swim', label: 'Swift Swim' }
];

// Generations preset
const GENERATIONS = [
  { value: '', label: 'Any Generation' },
  { value: '1', label: 'Generation I' },
  { value: '2', label: 'Generation II' },
  { value: '3', label: 'Generation III' },
  { value: '4', label: 'Generation IV' },
  { value: '5', label: 'Generation V' },
  { value: '6', label: 'Generation VI' },
  { value: '7', label: 'Generation VII' },
  { value: '8', label: 'Generation VIII' }
];

// Updated type colors for filtering with better contrast
const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#FF6B3D',
  water: '#4D90D5',
  electric: '#F8CF32',
  grass: '#68BB56',
  ice: '#74D0C3',
  fighting: '#CE416B',
  poison: '#AB5ACA',
  ground: '#D8765E',
  flying: '#767DC6',
  psychic: '#F45C85',
  bug: '#A1B135',
  rock: '#BBAA67',
  ghost: '#6C5A97',
  dragon: '#7764D0',
  dark: '#5E5366',
  steel: '#8A8EB5',
  fairy: '#ED91E6'
};

// Pokemon types list
const POKEMON_TYPES = Object.keys(typeColors);

const AdvancedFilters: React.FC = () => {
  const { filters, setFilter, clearFilters, activeFilterCount } = useFilters();
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // Convert empty strings to null for number fields
    if ((typeof value === 'string' && value === '') || value === null) {
      setFilter(key, null);
    } else if (
      ['minWeight', 'maxWeight', 'minHeight', 'maxHeight', 'minBaseStats', 'generation'].includes(key)
    ) {
      setFilter(key, value === '' ? null : Number(value));
    } else {
      setFilter(key, value);
    }
  };
  
  const handleTypeClick = (type: string) => {
    // Toggle off if already selected
    if (filters.type === type) {
      setFilter('type', null);
    } else {
      setFilter('type', type);
    }
  };
  
  return (
    <AnimatePresence>
      {filters.showAdvancedFilters && (
        <FiltersContainer
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiltersHeader>
            <FiltersTitle>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5h16v2H4V5zm6 5h10v2H10v-2zm4 5h6v2h-6v-2z"/>
              </svg>
              Advanced Filters
              {activeFilterCount > 0 && <FilterCount>{activeFilterCount}</FilterCount>}
            </FiltersTitle>
            <ResetButton onClick={clearFilters}>Reset Filters</ResetButton>
          </FiltersHeader>
          
          <FilterGrid>
            <FilterGroup>
              <FilterLabel htmlFor="ability-filter">Ability</FilterLabel>
              <Select
                id="ability-filter"
                value={filters.ability || ''}
                onChange={(e) => handleFilterChange('ability', e.target.value)}
              >
                {COMMON_ABILITIES.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="generation-filter">Generation</FilterLabel>
              <Select
                id="generation-filter"
                value={filters.generation || ''}
                onChange={(e) => handleFilterChange('generation', e.target.value)}
              >
                {GENERATIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Weight (kg)</FilterLabel>
              <NumberRangeContainer>
                <RangeInput
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filters.minWeight || ''}
                  onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                />
                <RangeInput
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filters.maxWeight || ''}
                  onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                />
              </NumberRangeContainer>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Height (m)</FilterLabel>
              <NumberRangeContainer>
                <RangeInput
                  type="number"
                  placeholder="Min"
                  min="0"
                  step="0.1"
                  value={filters.minHeight || ''}
                  onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                />
                <RangeInput
                  type="number"
                  placeholder="Max"
                  min="0"
                  step="0.1"
                  value={filters.maxHeight || ''}
                  onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                />
              </NumberRangeContainer>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel htmlFor="min-base-stats">Minimum Base Stats Total</FilterLabel>
              <RangeInput
                id="min-base-stats"
                type="number"
                placeholder="Min total stats"
                min="0"
                max="1000"
                value={filters.minBaseStats || ''}
                onChange={(e) => handleFilterChange('minBaseStats', e.target.value)}
              />
            </FilterGroup>
            
            {/* Add the Type filter section */}
            <TypesContainer>
              <TypesTitle>Filter by Type</TypesTitle>
              <TypeButtonsRow>
                {POKEMON_TYPES.map(type => (
                  <TypeButton 
                    key={type}
                    onClick={() => handleTypeClick(type)}
                    active={filters.type === type}
                    type={type}
                  >
                    {type}
                  </TypeButton>
                ))}
              </TypeButtonsRow>
            </TypesContainer>
          </FilterGrid>
        </FiltersContainer>
      )}
    </AnimatePresence>
  );
};

export default AdvancedFilters; 