import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { usePokemonList } from '../hooks/usePokemonList';
import { useSearchPokemon } from '../hooks/useSearchPokemon';
import { getPokemonDetail, getPokemonByType, PokemonDetail } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { useTheme } from '../contexts/ThemeContext';

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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 30px 0;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
  
  .dark-mode & {
    background: rgba(30, 30, 30, 0.4);
  }
`;

const TypeButtonsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  width: 100%;
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

const TypeButton = styled.button<{ isActive: boolean; typeColor: string }>`
  padding: 8px 16px;
  background-color: ${({ isActive, typeColor }) => isActive ? typeColor : 'transparent'};
  color: ${({ isActive }) => isActive ? 'white' : 'var(--text-light)'};
  border: 2px solid ${({ typeColor }) => typeColor};
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: -100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.4) 50%, 
      transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background-color: ${({ typeColor }) => typeColor};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:hover::after {
    left: 100%;
  }
  
  .dark-mode & {
    color: ${({ isActive }) => isActive ? 'white' : 'var(--text-dark)'};
    box-shadow: ${({ isActive, typeColor }) => isActive ? `0 0 15px ${typeColor}60` : 'none'};
  }
`;

const ClearFilterButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: var(--text-light);
  border: 2px solid var(--border-color-light);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background-color: transparent;
    transform: translateY(-3px);
  }
  
  .dark-mode & {
    color: var(--text-dark);
    border-color: var(--border-color-dark);
    
    &:hover {
      border-color: var(--accent-color);
      color: var(--accent-color);
    }
  }
`;

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
  position: relative;
  z-index: 2;
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
    background-color: var(--card-bg-dark);
    
    &::before {
      background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
    }
  }
`;

const SearchResultsTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: var(--primary-color);
  
  .dark-mode & {
    color: var(--accent-color);
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
      color: var(--accent-color);
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

const POKEMON_TYPES = Object.keys(typeColors);

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home: React.FC = () => {
  useTheme();
  const navigate = useNavigate();
  
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

  const handleTypeClick = (type: string) => {
    // Toggle off if already selected
    if (selectedType === type) {
      setSelectedType(null);
      navigate('/');
    } else {
      setSelectedType(type);
      navigate(`/?type=${type}`);
    }
    
    // Clear search if it was active
    if (searchQuery) {
      setSearchQuery('');
    }
  };
  
  const clearFilters = () => {
    setSelectedType(null);
    setSearchQuery('');
    navigate('/');
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
        
        {searchResults.length > 0 ? (
          <PokemonGrid>
            {searchResults.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
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
        
        {loadedPokemon.length > 0 ? (
          <PokemonGrid>
            {loadedPokemon.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
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
        <PokemonGrid>
          {loadedPokemon.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
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
          Explore and discover your favorite Pokémon from across the regions.
          Search by name or filter by type to find exactly what you're looking for!
        </Subtitle>
      </Header>
      
      <FiltersContainer>
        <TypesTitle>Filter by Type</TypesTitle>
        <TypeButtonsRow>
          {POKEMON_TYPES.slice(0, 9).map(type => (
            <TypeButton
              key={type}
              isActive={selectedType === type}
              typeColor={typeColors[type]}
              onClick={() => handleTypeClick(type)}
            >
              {type}
            </TypeButton>
          ))}
        </TypeButtonsRow>
        <TypeButtonsRow>
          {POKEMON_TYPES.slice(9).map(type => (
            <TypeButton
              key={type}
              isActive={selectedType === type}
              typeColor={typeColors[type]}
              onClick={() => handleTypeClick(type)}
            >
              {type}
            </TypeButton>
          ))}
        </TypeButtonsRow>
        
        {(selectedType || searchQuery) && (
          <ClearFilterButton onClick={clearFilters}>
            Clear Filters
          </ClearFilterButton>
        )}
      </FiltersContainer>
      
      {content}
    </HomeContainer>
  );
};

export default Home;
