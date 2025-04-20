import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';

import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AdvancedFilters from '../components/AdvancedFilters';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import PokemonCard from '../components/PokemonCard';
import PokemonCardSkeleton from '../components/PokemonCardSkeleton';
import { useFilters } from '../contexts/FilterContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { usePokemonList } from '../hooks/usePokemonList';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import { getPokemonDetail, getPokemonByType, PokemonDetail } from '../services/pokemonService';
import { applyFilters, PokemonCache } from '../utils/filterUtils';

const HomeContainer = styled.div`
  min-height: 100%;
  position: relative;
  z-index: 1;
  padding-top: 20px;
`;

const ParallaxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background-image: url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png");
    background-size: 150px;
    background-repeat: no-repeat;
    background-position: 90% -10px;
    opacity: 0.05;
    animation: float 10s ease-in-out infinite;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 300px;
    background-image: url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png");
    background-size: 200px;
    background-repeat: no-repeat;
    background-position: 10% bottom;
    opacity: 0.05;
    animation: float 12s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .dark-mode &::before, .dark-mode &::after {
    opacity: 0.07;
    filter: brightness(0.8);
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
  text-shadow: 0 5px 15px rgba(0,0,0,0.1);
  
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    border-radius: 4px;
  }
  
  .dark-mode & {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 25px auto 0;
  line-height: 1.6;
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const FiltersContainer = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px;
  position: relative;
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  border-radius: 50px;
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 5px 20px rgba(79, 193, 166, 0.2);
    background-color: white;
  }
  
  .dark-mode & {
    background-color: rgba(40, 40, 45, 0.8);
    color: var(--text-dark);
    
    &:focus {
      box-shadow: 0 5px 20px rgba(30, 30, 35, 0.3);
      background-color: rgba(45, 45, 50, 0.95);
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px 12px 40px;
    font-size: 1rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--primary-color);
  pointer-events: none;
  
  &::before {
    content: "🔍";
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    box-shadow: 0 5px 15px rgba(79, 193, 166, 0.3);
    transform: translateY(-50%) scale(1.05);
  }
  
  &::before {
    content: "→";
    font-size: 1.2rem;
  }
  
  .dark-mode & {
    background-color: rgba(50, 50, 55, 0.9);
    
    &:hover {
      background-color: rgba(60, 60, 65, 0.9);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
  }
`;

const ClearButton = styled.button`
  background-color: #f44336;
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.25);
  
  &:hover {
    background-color: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(244, 67, 54, 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .dark-mode & {
    background-color: #d32f2f;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    &:hover {
      background-color: #b71c1c;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
  }
`;

// ViewMode toggle controls
const ViewModeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
  
  @media (max-width: 480px) {
    margin: 15px 0;
  }
`;

const ViewModeLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    display: none;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 25px;
  
  @media (max-width: 768px) {
    margin-left: 15px;
  }
  
  @media (max-width: 480px) {
    margin-left: 10px;
  }
`;

const ViewToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.25)' : 'transparent'};
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.active ? 'var(--text-light)' : 'var(--text-light)'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    svg {
      fill: var(--text-light);
    }
  }
  
  .dark-mode & {
    background: ${props => props.active ? 'rgba(50, 50, 55, 0.5)' : 'transparent'};
    
    svg {
      fill: ${props => props.active ? 'rgba(235, 235, 240, 0.9)' : 'var(--text-dark)'};
    }
    
    &:hover {
      background: rgba(50, 50, 55, 0.4);
      svg {
        fill: rgba(235, 235, 240, 0.9);
      }
    }
  }
`;

// Define motion variants for grid and items
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

// Updated PokemonGrid to use motion
const PokemonGrid = styled(motion.div)<{ viewMode: string }>`
  display: grid;
  grid-template-columns: ${props => props.viewMode === 'grid' 
    ? 'repeat(auto-fill, minmax(220px, 1fr))' 
    : 'repeat(auto-fill, minmax(280px, 1fr))'};
  gap: ${props => props.viewMode === 'grid' ? '25px' : '35px'};
  margin-top: 40px;
  position: relative;
  z-index: 2;
  padding: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: ${props => props.viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(160px, 1fr))' 
      : '1fr'};
    gap: ${props => props.viewMode === 'grid' ? '20px' : '25px'};
    margin-top: 20px;
    padding: 5px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: ${props => props.viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(140px, 1fr))' 
      : '1fr'};
    gap: ${props => props.viewMode === 'grid' ? '15px' : '20px'};
    margin-top: 15px;
  }
`;

const PokemonItem = styled(motion.div)`
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SearchHeader = styled.div`
  margin: 20px 0 30px;
  text-align: center;
`;

const SearchResultsTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SearchResultsCount = styled.p`
  font-size: 1rem;
  color: var(--text-light-secondary);
  
  span {
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .dark-mode & {
    color: var(--text-dark-secondary);
    
    span {
      color: var(--accent-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
  padding: 16px 20px;
  border-radius: 4px;
  color: #d32f2f;
  font-weight: 500;
  margin: 30px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .dark-mode & {
    background-color: rgba(244, 67, 54, 0.15);
    color: #ff6659;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  img {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.6;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--text-light);
    
    .dark-mode & {
      color: var(--text-dark);
    }
  }
  
  p {
    color: var(--text-light-secondary);
    
    .dark-mode & {
      color: var(--text-dark-secondary);
    }
  }
`;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Update the filters toggle container styling
const FiltersToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 12px 0 20px;
`;

// Update the advanced filters toggle button to be more prominent
const AdvancedFiltersToggle = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.25);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(var(--primary-color-rgb), 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  &.open {
    background-color: var(--secondary-color);
    
    svg {
      transform: rotate(180deg);
    }
  }
  
  .dark-mode & {
    background-color: var(--accent-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    &:hover {
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
    }
    
    &.open {
      background-color: var(--primary-color);
    }
  }
`;

const FilterActiveIndicator = styled.span`
  background-color: #fff;
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  
  .dark-mode & {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }
`;

// Add these new styled components after the SearchButton component
const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border-radius: 12px;
  margin-top: 5px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  z-index: 10;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--primary-color-rgb), 0.5) transparent;
  
  /* Webkit scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(var(--primary-color-rgb), 0.5);
    border-radius: 10px;
    border: 2px solid transparent;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--primary-color-rgb), 0.7);
  }
  
  .dark-mode & {
    background-color: rgba(40, 40, 45, 0.95);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
    scrollbar-color: rgba(var(--secondary-color-rgb), 0.5) rgba(40, 40, 45, 0.2);
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(var(--secondary-color-rgb), 0.5);
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background-color: rgba(var(--secondary-color-rgb), 0.7);
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 3px;
    border-radius: 10px;
  }
`;

const SuggestionGroup = styled.div`
  padding: 10px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    
    .dark-mode & {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const SuggestionHeader = styled.div`
  padding: 5px 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  .dark-mode & {
    color: var(--text-dark-secondary);
  }
`;

const SuggestionItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .dark-mode &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.2);
  }
  
  .pokemon-id {
    font-size: 0.85rem;
    color: var(--text-light-secondary);
    font-weight: 500;
    
    .dark-mode & {
      color: var(--text-dark-secondary);
    }
  }
  
  .pokemon-name {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-light);
    text-transform: capitalize;
    
    .dark-mode & {
      color: var(--text-dark);
    }
  }
  
  .time-icon {
    margin-right: 5px;
    opacity: 0.7;
  }
`;

const ClearHistoryButton = styled.button`
  background: none;
  border: none;
  color: var(--text-light-secondary);
  font-size: 0.8rem;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: auto;
  display: block;
  
  &:hover {
    color: var(--danger-color);
    text-decoration: underline;
  }
  
  .dark-mode & {
    color: var(--text-dark-secondary);
    
    &:hover {
      color: var(--danger-color);
    }
  }
`;

const Home: React.FC = () => {
  useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { filters, clearFilters, toggleAdvancedFilters, activeFilterCount } = useFilters();
  const { searchHistory, addToSearchHistory, clearUserSearchHistory } = useUser();
  
  const { 
    pokemonList, 
    loading: loadingList, 
    error: listError, 
    page, 
    totalPages, 
    goToPage
  } = usePokemonList();
  
  const { 
    searchResults, 
    loading: loadingSearch, 
    error: searchError, 
    searchQuery, 
    setSearchQuery, 
    executeSearch
  } = useSearchPokemon();

  const [loadedPokemon, setLoadedPokemon] = useState<PokemonDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<Error | null>(null);
  
  // Create a ref for the cache to persist across renders
  const pokemonCacheRef = useRef(new PokemonCache());
  
  const query = useQuery();
  const searchParam = query.get('search');
  const viewParam = query.get('view');
  
  // Add a state for autocomplete suggestions and to show/hide the suggestion panel
  const [suggestions, setSuggestions] = useState<PokemonDetail[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Handle view mode via URL parameter
  useEffect(() => {
    if (viewParam === 'grid' || viewParam === 'list') {
      setViewMode(viewParam);
    }
  }, [viewParam]);
  
  // Handle search via URL parameter
  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
      executeSearch();
    }
  }, [searchParam, setSearchQuery, executeSearch]);
  
  // Function to fetch Pokemon details with caching
  const fetchPokemonDetails = useCallback(async (ids: string[]): Promise<PokemonDetail[]> => {
    const cache = pokemonCacheRef.current;
    const results: PokemonDetail[] = [];
    const idsToFetch: string[] = [];
    
    // Check which IDs are cached and which need to be fetched
    ids.forEach(id => {
      if (cache.hasPokemonDetail(id)) {
        const cachedPokemon = cache.getPokemonDetail(id);
        if (cachedPokemon) {
          results.push(cachedPokemon);
        }
      } else {
        idsToFetch.push(id);
      }
    });
    
    // Fetch the non-cached Pokemon
    if (idsToFetch.length > 0) {
      const fetchPromises = idsToFetch.map(id => getPokemonDetail(id));
      try {
        const fetchedPokemon = await Promise.all(fetchPromises);
        
        // Cache the fetched Pokemon
        fetchedPokemon.forEach((pokemon, index) => {
          cache.setPokemonDetail(idsToFetch[index], pokemon);
          results.push(pokemon);
        });
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        throw error;
      }
    }
    
    // Sort by ID to maintain consistent order
    return results.sort((a, b) => a.id - b.id);
  }, []);
  
  // Load Pokemon details from list
  useEffect(() => {
    if (pokemonList && !searchQuery && !filters.type) {
      const loadDetails = async () => {
        setLoadingDetails(true);
        try {
          // Extract IDs from URLs
          const ids = pokemonList.results.map(pokemon => {
            return pokemon.url.split('/').filter(Boolean).pop() || '';
          });
          
          // Fetch Pokemon details with caching
          const pokemonDetails = await fetchPokemonDetails(ids);
          
          // Apply filters to the Pokemon list
          const filteredPokemon = applyFilters(pokemonDetails, filters);
          
          setLoadedPokemon(filteredPokemon);
        } catch (error) {
          console.error('Failed to load Pokemon details:', error);
          setFilterError(error instanceof Error ? error : new Error('Failed to load Pokemon details'));
        } finally {
          setLoadingDetails(false);
        }
      };
      
      loadDetails();
    }
  }, [pokemonList, searchQuery, filters, fetchPokemonDetails]);
  
  // Handle type filtering with caching
  useEffect(() => {
    if (filters.type && typeof filters.type === 'string' && !searchQuery) {
      const loadPokemonByType = async () => {
        setFilterLoading(true);
        setFilterError(null);
        
        const cache = pokemonCacheRef.current;
        const type = filters.type as string;
        
        try {
          let typeResults;
          
          // Check cache first
          if (cache.hasTypeResults(type)) {
            typeResults = cache.getTypeResults(type);
          } else {
            // Fetch from API if not cached
            const apiResults = await getPokemonByType(type);
            
            // Get details for Pokemon of this type
            const detailsPromises = apiResults.results.slice(0, 20).map(pokemon => {
              const id = pokemon.url.split('/').filter(Boolean).pop() || '';
              return getPokemonDetail(id);
            });
            
            typeResults = await Promise.all(detailsPromises);
            
            // Cache the results
            cache.setTypeResults(type, typeResults);
          }
          
          if (typeResults) {
            // Apply additional filters
            const filteredPokemon = applyFilters(typeResults, filters);
            setLoadedPokemon(filteredPokemon);
          } else {
            setLoadedPokemon([]);
          }
        } catch (error) {
          console.error(`Failed to load ${type} type Pokemon:`, error);
          setFilterError(error instanceof Error ? error : new Error(`Failed to load ${type} type Pokemon`));
        } finally {
          setFilterLoading(false);
        }
      };
      
      loadPokemonByType();
    }
  }, [filters, searchQuery]);

  // Memoize the view mode toggle handler to prevent recreation on every render
  const handleViewModeToggle = useCallback((mode: 'list' | 'grid') => {
    setViewMode(mode);
    
    // Update URL with the view mode
    const params = new URLSearchParams(window.location.search);
    params.set('view', mode);
    
    navigate(`/?${params.toString()}`);
  }, [navigate]);

  // Add this function for handling Pokemon suggestions
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length >= 2) {
      // Show suggestions when typing
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [setSearchQuery]);
  
  // Update suggestions when search results change
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery.trim().length >= 2) {
      setSuggestions(searchResults.slice(0, 5));
    }
  }, [searchResults, searchQuery]);
  
  // Handle clicking outside the search form to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Select a suggestion
  const handleSelectSuggestion = useCallback((pokemon: PokemonDetail) => {
    setSearchQuery(pokemon.name);
    setShowSuggestions(false);
    // Add to search history
    addToSearchHistory(pokemon.name);
    
    // Update URL and navigate
    const params = new URLSearchParams(window.location.search);
    params.set('search', pokemon.name);
    if (viewMode !== 'list') {
      params.set('view', viewMode);
    }
    
    navigate(`/?${params.toString()}`);
    executeSearch();
  }, [setSearchQuery, addToSearchHistory, viewMode, navigate, executeSearch]);
  
  // Handle selecting a recent search
  const handleSelectRecentSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    
    // Update URL and navigate
    const params = new URLSearchParams(window.location.search);
    params.set('search', query);
    if (viewMode !== 'list') {
      params.set('view', viewMode);
    }
    
    navigate(`/?${params.toString()}`);
    executeSearch();
  }, [setSearchQuery, viewMode, navigate, executeSearch]);
  
  // Update the search submission handler to also add to history
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to search history
      addToSearchHistory(searchQuery);
      
      const params = new URLSearchParams(window.location.search);
      params.set('search', searchQuery);
      if (viewMode !== 'list') {
        params.set('view', viewMode);
      }
      
      // Clear all filters when searching
      clearFilters();
      
      navigate(`/?${params.toString()}`);
      executeSearch();
      setShowSuggestions(false);
    }
  }, [searchQuery, viewMode, navigate, clearFilters, executeSearch, addToSearchHistory]);

  // Clear cache when component unmounts
  useEffect(() => {
    const cache = pokemonCacheRef.current;
    return () => {
      cache.clear();
    };
  }, []);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    
    // Get the total number of selectable items (suggestions + recent searches)
    const totalSuggestions = suggestions.length;
    const totalHistory = searchHistory.length > 0 ? Math.min(searchHistory.length, 5) : 0;
    const totalItems = totalSuggestions + totalHistory;
    
    if (totalItems === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => 
          prevIndex < totalItems - 1 ? prevIndex + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : totalItems - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          if (selectedSuggestionIndex < totalSuggestions) {
            // Handle Pokemon suggestion selection
            handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
          } else {
            // Handle recent search selection
            const historyIndex = selectedSuggestionIndex - totalSuggestions;
            handleSelectRecentSearch(searchHistory[historyIndex]);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, searchHistory, handleSelectSuggestion, handleSelectRecentSearch, selectedSuggestionIndex]);
  
  // Reset selected suggestion index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions, searchHistory]);

  // Memoize the content display logic to avoid unnecessary recalculations
  const content = useMemo(() => {
    if (listError || searchError || filterError) {
      return (
        <ErrorMessage>
          {listError?.message || searchError?.message || filterError?.message || 'Failed to load Pokémon data'}
        </ErrorMessage>
      );
    }
    
    if (loadingList || loadingSearch || loadingDetails || filterLoading) {
      // Use the new Loading component instead of a div
      return <Loading />;
    }
    
    if (searchQuery && searchResults) {
      return (
        <>
          <SearchHeader>
            <SearchResultsTitle>Search Results for {searchQuery}</SearchResultsTitle>
            <SearchResultsCount>
              Found <span>{searchResults.length}</span> Pokémon
            </SearchResultsCount>
          </SearchHeader>
          
          {/* View Mode Toggle */}
          <ViewModeContainer>
            <ViewModeLabel>View Mode:</ViewModeLabel>
            <ViewToggle>
              <ViewToggleButton 
                active={viewMode === 'grid'} 
                onClick={() => handleViewModeToggle('grid')}
                aria-label="Grid View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </ViewToggleButton>
              <ViewToggleButton 
                active={viewMode === 'list'} 
                onClick={() => handleViewModeToggle('list')}
                aria-label="List View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </ViewToggleButton>
            </ViewToggle>
          </ViewModeContainer>
          
          {searchResults.length > 0 ? (
            <PokemonGrid 
              viewMode={viewMode}
              variants={gridVariants}
              initial="hidden"
              animate="show"
            >
              {searchResults.map(pokemon => (
                <PokemonItem 
                  key={pokemon.id}
                  variants={itemVariants}
                >
                  <PokemonCard pokemon={pokemon} viewMode={viewMode} />
                </PokemonItem>
              ))}
            </PokemonGrid>
          ) : (
            <NoResults>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png" alt="Magikarp" />
              <h3>No Pokémon Found</h3>
              <p>Try searching for another Pokémon name or ID</p>
            </NoResults>
          )}
        </>
      );
    }
    
    if (filters.type) {
      return (
        <>
          <SearchHeader>
            <SearchResultsTitle>{filters.type} Type Pokémon</SearchResultsTitle>
            <SearchResultsCount>
              Showing <span>{loadedPokemon.length}</span> Pokémon
            </SearchResultsCount>
          </SearchHeader>
          
          {/* View Mode Toggle */}
          <ViewModeContainer>
            <ViewModeLabel>View Mode:</ViewModeLabel>
            <ViewToggle>
              <ViewToggleButton 
                active={viewMode === 'grid'} 
                onClick={() => handleViewModeToggle('grid')}
                aria-label="Grid View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </ViewToggleButton>
              <ViewToggleButton 
                active={viewMode === 'list'} 
                onClick={() => handleViewModeToggle('list')}
                aria-label="List View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </ViewToggleButton>
            </ViewToggle>
          </ViewModeContainer>
          
          {loadedPokemon.length > 0 ? (
            <PokemonGrid 
              viewMode={viewMode}
              variants={gridVariants}
              initial="hidden"
              animate="show"
            >
              {loadedPokemon.map(pokemon => (
                <PokemonItem 
                  key={pokemon.id}
                  variants={itemVariants}
                >
                  <PokemonCard pokemon={pokemon} viewMode={viewMode} />
                </PokemonItem>
              ))}
            </PokemonGrid>
          ) : (
            <NoResults>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" alt="Psyduck" />
              <h3>No Pokémon Found</h3>
              <p>Try selecting different filter options</p>
            </NoResults>
          )}
        </>
      );
    }
    
    if (loadedPokemon.length > 0) {
      return (
        <>
          <ViewModeContainer>
            <ViewModeLabel>View Mode:</ViewModeLabel>
            <ViewToggle>
              <ViewToggleButton 
                active={viewMode === 'grid'} 
                onClick={() => handleViewModeToggle('grid')}
                aria-label="Grid View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </ViewToggleButton>
              <ViewToggleButton 
                active={viewMode === 'list'} 
                onClick={() => handleViewModeToggle('list')}
                aria-label="List View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </ViewToggleButton>
            </ViewToggle>
          </ViewModeContainer>
          
          <PokemonGrid 
            viewMode={viewMode}
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {loadedPokemon.map(pokemon => (
              <PokemonItem 
                key={pokemon.id}
                variants={itemVariants}
              >
                <PokemonCard pokemon={pokemon} viewMode={viewMode} />
              </PokemonItem>
            ))}
          </PokemonGrid>
          
          {/* Only show pagination when no filters are active */}
          {!activeFilterCount && (
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={goToPage} 
            />
          )}
        </>
      );
    }
    
    // For the initial home screen when data is loading
    if (loadingList || loadingDetails) {
      return (
        <>
          <ViewModeContainer>
            <ViewModeLabel>View Mode:</ViewModeLabel>
            <ViewToggle>
              <ViewToggleButton 
                active={viewMode === 'grid'} 
                onClick={() => handleViewModeToggle('grid')}
                aria-label="Grid View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </ViewToggleButton>
              <ViewToggleButton 
                active={viewMode === 'list'} 
                onClick={() => handleViewModeToggle('list')}
                aria-label="List View"
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </ViewToggleButton>
            </ViewToggle>
          </ViewModeContainer>
          
          <PokemonGrid 
            viewMode={viewMode}
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {/* Display skeleton loaders instead of a loading message */}
            {Array.from({ length: 12 }).map((_, index) => (
              <PokemonItem 
                key={index}
                variants={itemVariants}
              >
                <PokemonCardSkeleton viewMode={viewMode} />
              </PokemonItem>
            ))}
          </PokemonGrid>
        </>
      );
    }
    
    return <Loading />;
  }, [
    listError, searchError, filterError, 
    loadingList, loadingSearch, loadingDetails, filterLoading,
    searchQuery, searchResults, filters.type, loadedPokemon, 
    viewMode, handleViewModeToggle, page, totalPages, goToPage, activeFilterCount
  ]);

  // Function to clear both filters and search query
  const handleClearAllFilters = useCallback(() => {
    // Clear the search query
    setSearchQuery('');
    
    // Update URL to remove search parameter
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    if (viewMode !== 'list') {
      params.set('view', viewMode);
    }
    
    // Navigate to updated URL
    navigate(`/?${params.toString()}`);
    
    // Clear all other filters
    clearFilters();
  }, [clearFilters, navigate, setSearchQuery, viewMode]);

  return (
    <HomeContainer>
      <ParallaxBackground />
      
      <Header>
        <Title>Pokémon Explorer</Title>
        <Subtitle>
          Discover and explore detailed information about your favorite Pokémon
        </Subtitle>
      </Header>
      
      <FiltersContainer>
        <SearchForm ref={searchFormRef} onSubmit={handleSearchSubmit}>
          <SearchIcon />
          <SearchInput 
            type="text"
            placeholder="Search for a Pokémon by name or ID..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
          />
          <SearchButton type="submit" aria-label="Search" />
          
          {/* Autocomplete suggestions and recent searches */}
          {showSuggestions && (
            <SuggestionsContainer>
              {/* Autocomplete suggestions */}
              {suggestions.length > 0 && (
                <SuggestionGroup>
                  <SuggestionHeader>Pokémon Suggestions</SuggestionHeader>
                  {suggestions.map((pokemon, index) => (
                    <SuggestionItem 
                      key={pokemon.id} 
                      onClick={() => handleSelectSuggestion(pokemon)}
                      style={{
                        backgroundColor: selectedSuggestionIndex === index 
                          ? 'rgba(var(--primary-color-rgb), 0.15)' 
                          : 'transparent'
                      }}
                    >
                      <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                      <span className="pokemon-name">{pokemon.name}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionGroup>
              )}
              
              {/* Recent searches */}
              {searchHistory.length > 0 && (
                <SuggestionGroup>
                  <SuggestionHeader>
                    Recent Searches
                    <ClearHistoryButton onClick={(e) => {
                      e.stopPropagation();
                      clearUserSearchHistory();
                      setShowSuggestions(false);
                    }}>
                      Clear History
                    </ClearHistoryButton>
                  </SuggestionHeader>
                  {searchHistory.slice(0, 5).map((query, index) => (
                    <SuggestionItem 
                      key={index} 
                      onClick={() => handleSelectRecentSearch(query)}
                      style={{
                        backgroundColor: selectedSuggestionIndex === (suggestions.length + index) 
                          ? 'rgba(var(--primary-color-rgb), 0.15)' 
                          : 'transparent'
                      }}
                    >
                      <span className="time-icon">⏱️</span>
                      <span className="pokemon-name">{query}</span>
                    </SuggestionItem>
                  ))}
                </SuggestionGroup>
              )}
            </SuggestionsContainer>
          )}
        </SearchForm>
        
        <FiltersToggleContainer>
          <AdvancedFiltersToggle 
            onClick={toggleAdvancedFilters}
            className={filters.showAdvancedFilters ? 'open' : ''}
            aria-expanded={filters.showAdvancedFilters}
            aria-controls="advanced-filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4h18v2H3V4zm4 7h10v2H7v-2zm4 7h2v2h-2v-2z"/>
            </svg>
            {filters.showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
            {activeFilterCount > 0 && <FilterActiveIndicator>{activeFilterCount}</FilterActiveIndicator>}
          </AdvancedFiltersToggle>
        </FiltersToggleContainer>
        
        <AdvancedFilters />
        
        {(activeFilterCount > 0 || searchQuery) && (
          <ClearButton onClick={handleClearAllFilters}>
            Clear All Filters
          </ClearButton>
        )}
      </FiltersContainer>
      
      {content}
    </HomeContainer>
  );
};

export default Home;
