import React, { createContext, useContext, useState, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

// Define filter options
export interface FilterOptions {
  type: string | null;
  ability: string | null;
  minWeight: number | null;
  maxWeight: number | null;
  minHeight: number | null;
  maxHeight: number | null;
  minBaseStats: number | null;
  generation: number | null;
  showAdvancedFilters: boolean;
}

// Define the context type
interface FilterContextType {
  filters: FilterOptions;
  setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  clearFilters: () => void;
  toggleAdvancedFilters: () => void;
  activeFilterCount: number;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Default filter values
const defaultFilters: FilterOptions = {
  type: null,
  ability: null,
  minWeight: null,
  maxWeight: null,
  minHeight: null,
  maxHeight: null,
  minBaseStats: null,
  generation: null,
  showAdvancedFilters: false
};

// Provider component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const navigate = useNavigate();
  const location = useLocation();

  // Load filters from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = { ...defaultFilters };
    
    if (params.has('type')) newFilters.type = params.get('type');
    if (params.has('ability')) newFilters.ability = params.get('ability');
    if (params.has('minWeight')) newFilters.minWeight = Number(params.get('minWeight'));
    if (params.has('maxWeight')) newFilters.maxWeight = Number(params.get('maxWeight'));
    if (params.has('minHeight')) newFilters.minHeight = Number(params.get('minHeight'));
    if (params.has('maxHeight')) newFilters.maxHeight = Number(params.get('maxHeight'));
    if (params.has('minBaseStats')) newFilters.minBaseStats = Number(params.get('minBaseStats'));
    if (params.has('generation')) newFilters.generation = Number(params.get('generation'));
    
    // Check if any advanced filters are active to determine if we should show the panel
    const hasAdvancedFilters = 
      newFilters.ability || 
      newFilters.minWeight || 
      newFilters.maxWeight || 
      newFilters.minHeight || 
      newFilters.maxHeight || 
      newFilters.minBaseStats || 
      newFilters.generation;
      
    newFilters.showAdvancedFilters = !!hasAdvancedFilters;
    
    setFilters(newFilters);
  }, [location.search]);

  // Set a single filter and update URL
  const setFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    // Special case for showAdvancedFilters which doesn't affect URL
    if (key === 'showAdvancedFilters') {
      setFilters(prev => ({ ...prev, [key]: value }));
      return;
    }
    
    // For all other filters, update URL and state
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Build URL params
    const params = new URLSearchParams(location.search);
    
    // Handle each filter type
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    
    // Keep view param if it exists
    const viewParam = new URLSearchParams(location.search).get('view');
    if (viewParam) {
      params.set('view', viewParam);
    }

    // Update URL
    navigate(`/?${params.toString()}`);
  };

  // Clear all filters and update URL
  const clearFilters = () => {
    setFilters({...defaultFilters, showAdvancedFilters: filters.showAdvancedFilters}); // Preserve panel visibility
    
    // Keep only the view parameter if it exists
    const params = new URLSearchParams();
    const viewParam = new URLSearchParams(location.search).get('view');
    if (viewParam) {
      params.set('view', viewParam);
    }
    
    navigate(`/?${params.toString()}`);
  };

  // Toggle advanced filters panel visibility
  const toggleAdvancedFilters = () => {
    setFilters(prev => ({ ...prev, showAdvancedFilters: !prev.showAdvancedFilters }));
  };

  // Count active filters (excluding showAdvancedFilters)
  const activeFilterCount = Object.entries(filters)
    .filter(([key, value]) => key !== 'showAdvancedFilters' && value !== null && value !== '')
    .length;

  const value = {
    filters,
    setFilter,
    clearFilters,
    toggleAdvancedFilters,
    activeFilterCount
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

// Hook for using the filter context
export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 