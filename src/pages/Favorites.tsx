import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUser } from '../contexts/UserContext';
import { getPokemonDetail } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';

// Styled components
const FavoritesContainer = styled.div`
  min-height: 100%;
  position: relative;
  z-index: 1;
  padding: 20px 0 40px;
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
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    
    &::after {
      width: 80px;
      height: 3px;
    }
  }
  
  @media (max-width: 360px) {
    font-size: 1.8rem;
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
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    max-width: 90%;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    max-width: 95%;
    margin-top: 15px;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 0 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    padding: 0 15px;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  margin: 60px auto;
  max-width: 500px;
  padding: 40px;
  border-radius: 20px;
  background-color: rgba(var(--bg-light-rgb), 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  .dark-mode & {
    background-color: rgba(var(--bg-dark-lighter-rgb), 0.5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 30px;
  }
  
  @media (max-width: 480px) {
    margin: 40px auto;
    padding: 25px 15px;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: var(--text-light);
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: var(--text-light-secondary);
  line-height: 1.6;
  
  .dark-mode & {
    color: var(--text-dark-secondary);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const EmptyStateImage = styled.img`
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
  opacity: 0.7;
  filter: grayscale(30%);
  
  .dark-mode & {
    filter: grayscale(30%) brightness(0.8);
  }
`;

const ExploreButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(var(--primary-color-rgb), 0.3);
  
  &:hover {
    box-shadow: 0 15px 25px rgba(var(--primary-color-rgb), 0.4);
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ClearButton = styled(motion.button)`
  background: transparent;
  color: var(--text-light-secondary);
  border: 2px solid var(--text-light-secondary);
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  
  .dark-mode & {
    color: var(--text-dark-secondary);
    border-color: var(--text-dark-secondary);
  }
  
  &:hover {
    color: var(--danger-color);
    border-color: var(--danger-color);
  }
`;

const Favorites: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, favoriteDetails, clearAllFavorites } = useFavorites();
  const { isLoggedIn } = useUser();
  const pokemonState = useSelector((state: RootState) => state.pokemon);
  
  // Use useMemo to prevent unnecessary recalculations
  const pokemonDetails = useMemo(() => pokemonState?.pokemonDetails || {}, [pokemonState?.pokemonDetails]);
  
  const [favoritesList, setFavoritesList] = useState<{ [key: string]: any }>({});
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    // Merge favorite details from Redux and context
    const loadFavorites = async () => {
      setLoading(true);
      
      try {
        const allFavorites: { [key: string]: any } = {};
        
        // First check if we already have the pokemon in Redux or context
        for (const id of favorites) {
          if (favoriteDetails[id]) {
            allFavorites[id] = favoriteDetails[id];
          } else if (pokemonDetails[id]) {
            allFavorites[id] = pokemonDetails[id];
          } else {
            // If not, fetch it
            try {
              const pokemon = await getPokemonDetail(id);
              allFavorites[id] = pokemon;
            } catch (error) {
              console.error(`Error fetching Pokemon ${id}:`, error);
            }
          }
        }
        
        setFavoritesList(allFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFavorites();
  }, [favorites, favoriteDetails, pokemonDetails, isLoggedIn, navigate]);
  
  const handleExplore = () => {
    navigate('/');
  };
  
  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      clearAllFavorites();
    }
  };
  
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <FavoritesContainer>
      <Header>
        <Title>Your Favorites</Title>
        <Subtitle>
          Your personally curated collection of Pokémon you've favorited.
        </Subtitle>
      </Header>
      
      {favorites.length > 0 ? (
        <>
          <ActionRow>
            <ClearButton
              onClick={handleClearFavorites}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All Favorites
            </ClearButton>
          </ActionRow>
          
          <CardsGrid>
            {favorites.map(id => (
              favoritesList[id] && (
                <PokemonCard 
                  key={id} 
                  pokemon={favoritesList[id]} 
                  viewMode="grid" 
                />
              )
            ))}
          </CardsGrid>
        </>
      ) : (
        <EmptyState>
          <EmptyStateImage 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-ball.png" 
            alt="Empty favorites" 
          />
          <EmptyStateTitle>No Favorites Yet</EmptyStateTitle>
          <EmptyStateText>
            You haven't added any Pokémon to your favorites yet. 
            Browse the Pokédex and click the heart icon to start building your collection!
          </EmptyStateText>
          <ExploreButton
            onClick={handleExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Pokémon
          </ExploreButton>
        </EmptyState>
      )}
    </FavoritesContainer>
  );
};

export default Favorites; 