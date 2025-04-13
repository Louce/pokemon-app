import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePokemonList } from '../hooks/usePokemonList';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import { getPokemonDetail, getPokemonByType, PokemonDetail } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

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
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png');
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
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png');
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

const ParallaxLayer1 = styled.div`
  position: absolute;
  top: 20%;
  left: 5%;
  width: 120px;
  height: 120px;
  background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.05;
  animation: parallaxMove 15s ease-in-out infinite alternate;
  z-index: -1;
`;

const ParallaxLayer2 = styled.div`
  position: absolute;
  top: 60%;
  right: 8%;
  width: 100px;
  height: 100px;
  background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.05;
  animation: parallaxMove 20s ease-in-out infinite alternate-reverse;
  z-index: -1;
`;

const ParallaxLayer3 = styled.div`
  position: absolute;
  bottom: 15%;
  left: 15%;
  width: 80px;
  height: 80px;
  background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.04;
  animation: parallaxMove 12s ease-in-out infinite alternate;
  animation-delay: 0.5s;
  z-index: -1;
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

const TypeButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const TypesTitle = styled.h3`
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

const TypeButton = styled.button<{ active: boolean; type: string }>`
  padding: 10px 15px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-right: 10px;
  margin-bottom: 10px;
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

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    margin-right: 6px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    margin-right: 4px;
    margin-bottom: 4px;
    border-radius: 12px;
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
    content: '🔍';
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
    content: '→';
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
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--primary-color);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:hover:after {
    opacity: 1;
  }
  
  .dark-mode & {
    border-color: rgba(60, 60, 65, 0.9);
    color: rgba(235, 235, 240, 0.9);
    
    &:after {
      background-color: rgba(50, 50, 55, 0.9);
    }
    
    &:hover {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
    padding: 0;
  }
`;

const PokemonItem = styled(motion.div)`
  height: 100%;
`;

const SearchHeader = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--card-bg-light);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }
  
  .dark-mode & {
    background-color: rgba(28, 28, 32, 0.9);
    
    &::before {
      background: linear-gradient(90deg, rgba(50, 50, 55, 0.9), rgba(40, 40, 45, 0.9));
    }
  }
`;

const SearchResultsTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: var(--primary-color);
  
  .dark-mode & {
    color: rgba(235, 235, 240, 0.9);
  }
`;

const SearchResultsCount = styled.p`
  color: var(--text-light);
  font-size: 1.1rem;
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  span {
    font-weight: 600;
    color: var(--secondary-color);
    
    .dark-mode & {
      color: rgba(200, 200, 210, 0.9);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 82, 82, 0.1);
  color: #d32f2f;
  padding: 20px;
  border-radius: var(--border-radius);
  margin: 30px 0;
  text-align: center;
  border-left: 5px solid #d32f2f;
  font-weight: 500;
  
  .dark-mode & {
    background-color: rgba(255, 82, 82, 0.05);
    color: #ff8a8a;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 60px 0;
  color: var(--text-light);
  font-size: 1.2rem;
  
  img {
    width: 120px;
    margin-bottom: 20px;
    opacity: 0.7;
    filter: grayscale(0.5);
    animation: float 3s ease-in-out infinite;
  }
  
  p {
    margin-top: 15px;
    opacity: 0.7;
  }
  
  .dark-mode & {
    color: var(--text-dark);
  }
`;

// Updated Type colors for filtering with better contrast
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

// Featured Pokemon Section
const FeaturedSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  background: rgba(141, 68, 173, 0.1);
  border-radius: 24px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  .dark-mode & {
    background: rgba(224, 86, 253, 0.05);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturedTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  font-weight: 700;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    height: 3px;
    width: 50px;
    background: var(--secondary-color);
    border-radius: 3px;
  }
  
  .dark-mode & {
    color: var(--secondary-color);
    
    &::after {
      background: var(--accent-color);
    }
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const FeaturedPokemonCard = styled(Link)`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 15px;
  text-decoration: none;
  color: var(--text-light);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
  
  .dark-mode & {
    background: var(--card-bg-dark);
    color: var(--text-dark);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    
    &:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
  }
`;

const FeaturedPokemonImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-right: 15px;
`;

const FeaturedPokemonInfo = styled.div`
  flex: 1;
`;

const FeaturedPokemonName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 5px;
  text-transform: capitalize;
`;

const FeaturedPokemonType = styled.span<{ type: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
  margin-right: 5px;
  color: white;
  background-color: ${props => typeColors[props.type] || typeColors.normal};
`;

// Updated Type colors for filtering with better contrast
const POKEMON_TYPES = Object.keys(typeColors);

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home: React.FC = () => {
  useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<Error | null>(null);
  
  const query = useQuery();
  const searchParam = query.get('search');
  const typeParam = query.get('type');
  const viewParam = query.get('view');
  
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
  
  // Handle type filter via URL parameter
  useEffect(() => {
    if (typeParam && POKEMON_TYPES.includes(typeParam)) {
      setSelectedType(typeParam);
    } else {
      setSelectedType(null);
    }
  }, [typeParam]);
  
  // Load Pokemon details from list
  useEffect(() => {
    if (pokemonList && !searchQuery && !selectedType) {
      const loadDetails = async () => {
        setLoadingDetails(true);
        try {
          const detailsPromises = pokemonList.results.map(pokemon => {
            // Extract ID from URL (format: https://pokeapi.co/api/v2/pokemon/1/)
            const id = pokemon.url.split('/').filter(Boolean).pop();
            return getPokemonDetail(id || '');
          });
          
          const pokemonDetails = await Promise.all(detailsPromises);
          setLoadedPokemon(pokemonDetails);
        } catch (error) {
          console.error('Failed to load Pokemon details:', error);
        } finally {
          setLoadingDetails(false);
        }
      };
      
      loadDetails();
    }
  }, [pokemonList, searchQuery, selectedType]);
  
  // Handle type filtering
  useEffect(() => {
    if (selectedType && !searchQuery) {
      const loadPokemonByType = async () => {
        setFilterLoading(true);
        setFilterError(null);
        try {
          const typeResults = await getPokemonByType(selectedType);
          
          // Get details for first 20 Pokemon of this type
          const detailsPromises = typeResults.results.slice(0, 20).map(pokemon => {
            const id = pokemon.url.split('/').filter(Boolean).pop();
            return getPokemonDetail(id || '');
          });
          
          const pokemonDetails = await Promise.all(detailsPromises);
          setLoadedPokemon(pokemonDetails);
        } catch (error) {
          console.error(`Failed to load ${selectedType} type Pokemon:`, error);
          setFilterError(error instanceof Error ? error : new Error('Failed to load Pokemon by type'));
        } finally {
          setFilterLoading(false);
        }
      };
      
      loadPokemonByType();
    }
  }, [selectedType, searchQuery]);

  const handleViewModeToggle = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    
    // Update URL with the view mode
    const params = new URLSearchParams(window.location.search);
    params.set('view', mode);
    
    // Preserve existing search or type parameters
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (selectedType) {
      params.set('type', selectedType);
    }
    
    navigate(`/?${params.toString()}`);
  };

  const handleTypeClick = (type: string) => {
    // Toggle off if already selected
    if (selectedType === type) {
      setSelectedType(null);
      
      const params = new URLSearchParams();
      if (viewMode !== 'list') {
        params.set('view', viewMode);
      }
      navigate(`/?${params.toString() || ''}`);
    } else {
      setSelectedType(type);
      
      const params = new URLSearchParams();
      params.set('type', type);
      if (viewMode !== 'list') {
        params.set('view', viewMode);
      }
      navigate(`/?${params.toString()}`);
    }
    
    // Clear search if it was active
    if (searchQuery) {
      setSearchQuery('');
    }
  };
  
  const clearFilters = () => {
    setSelectedType(null);
    setSearchQuery('');
    
    const params = new URLSearchParams();
    if (viewMode !== 'list') {
      params.set('view', viewMode);
    }
    navigate(`/?${params.toString() || ''}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      if (viewMode !== 'list') {
        params.set('view', viewMode);
      }
      navigate(`/?${params.toString()}`);
      executeSearch();
    }
  };

  // Determine what to show: error, loading, or content
  let content;
  
  if (listError || searchError || filterError) {
    content = (
      <ErrorMessage>
        {listError?.message || searchError?.message || filterError?.message || 'Failed to load Pokémon data'}
      </ErrorMessage>
    );
  } else if (loadingList || loadingSearch || loadingDetails || filterLoading) {
    content = <Loading />;
  } else if (searchQuery && searchResults) {
    content = (
      <>
        <SearchHeader>
          <SearchResultsTitle>Search Results for "{searchQuery}"</SearchResultsTitle>
          <SearchResultsCount>
            Found <span>{searchResults.length}</span> Pokémon
          </SearchResultsCount>
        </SearchHeader>
        
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
  } else if (selectedType) {
    content = (
      <>
        <SearchHeader>
          <SearchResultsTitle>{selectedType} Type Pokémon</SearchResultsTitle>
          <SearchResultsCount>
            Showing <span>{loadedPokemon.length}</span> Pokémon
          </SearchResultsCount>
        </SearchHeader>
        
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
            <p>Try selecting a different type</p>
          </NoResults>
        )}
      </>
    );
  } else if (loadedPokemon.length > 0) {
    content = (
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
        
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={goToPage} 
        />
      </>
    );
  } else {
    content = <Loading />;
  }

  return (
    <HomeContainer>
      <ParallaxBackground>
        <ParallaxLayer1 />
        <ParallaxLayer2 />
        <ParallaxLayer3 />
      </ParallaxBackground>
      
      <Header>
        <Title>Pokémon Explorer</Title>
        <Subtitle>
          Discover and explore detailed information about your favorite Pokémon
        </Subtitle>
      </Header>
      
      <FeaturedSection>
        <FeaturedTitle>Featured Pokémon</FeaturedTitle>
        <FeaturedGrid>
          <FeaturedPokemonCard to="/pokemon/25">
            <FeaturedPokemonImage src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" />
            <FeaturedPokemonInfo>
              <FeaturedPokemonName>Pikachu</FeaturedPokemonName>
              <FeaturedPokemonType type="electric">electric</FeaturedPokemonType>
            </FeaturedPokemonInfo>
          </FeaturedPokemonCard>
          <FeaturedPokemonCard to="/pokemon/94">
            <FeaturedPokemonImage src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" alt="Gengar" />
            <FeaturedPokemonInfo>
              <FeaturedPokemonName>Gengar</FeaturedPokemonName>
              <FeaturedPokemonType type="ghost">ghost</FeaturedPokemonType>
              <FeaturedPokemonType type="poison">poison</FeaturedPokemonType>
            </FeaturedPokemonInfo>
          </FeaturedPokemonCard>
          <FeaturedPokemonCard to="/pokemon/150">
            <FeaturedPokemonImage src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" alt="Mewtwo" />
            <FeaturedPokemonInfo>
              <FeaturedPokemonName>Mewtwo</FeaturedPokemonName>
              <FeaturedPokemonType type="psychic">psychic</FeaturedPokemonType>
            </FeaturedPokemonInfo>
          </FeaturedPokemonCard>
        </FeaturedGrid>
      </FeaturedSection>
      
      <FiltersContainer>
        <SearchForm onSubmit={handleSearch}>
          <SearchIcon />
          <SearchInput 
            type="text"
            placeholder="Search for a Pokémon by name or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit" aria-label="Search" />
        </SearchForm>
        
        <TypesTitle>Filter by Type</TypesTitle>
        <TypeButtonsRow>
          {POKEMON_TYPES.map(type => (
            <TypeButton 
              key={type}
              onClick={() => handleTypeClick(type)}
              active={selectedType === type}
              type={type}
            >
              {type}
            </TypeButton>
          ))}
        </TypeButtonsRow>
        
        {(selectedType || searchQuery) && (
          <ClearButton onClick={clearFilters}>
            Clear Filters
          </ClearButton>
        )}
      </FiltersContainer>
      
      {content}
    </HomeContainer>
  );
};

export default Home;
