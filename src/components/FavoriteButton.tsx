import React from 'react';

import { motion } from 'framer-motion';
import styled from 'styled-components';

import { useFavorites } from '../contexts/FavoritesContext';
import { PokemonDetail } from '../services/pokemonService';

// Styled components
const FavoriteButtonContainer = styled(motion.button)<{ isFavorite: boolean; viewMode?: 'list' | 'grid' }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  ${props => props.viewMode === 'list' && `
    @media (max-width: 768px) {
      bottom: 10px;
      right: 10px;
    }
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode & {
    background-color: rgba(40, 44, 52, 0.7);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:hover {
      background-color: rgba(40, 44, 52, 0.9);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    bottom: 8px;
    right: 8px;
  }
  
  @media (max-width: 360px) {
    padding: 5px;
    bottom: 6px;
    right: 6px;
  }
`;

const HeartIcon = styled.svg<{ isFavorite: boolean }>`
  width: 24px;
  height: 24px;
  fill: ${props => props.isFavorite ? '#ff366e' : 'transparent'};
  stroke: ${props => props.isFavorite ? '#ff366e' : '#666'};
  stroke-width: 2;
  transition: all 0.3s ease;
  
  .dark-mode & {
    stroke: ${props => props.isFavorite ? '#ff366e' : '#bbb'};
  }
`;

interface FavoriteButtonProps {
  pokemonId: string;
  pokemon?: PokemonDetail;
  className?: string;
  viewMode?: 'list' | 'grid';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  pokemonId, 
  pokemon, 
  className,
  viewMode 
}) => {
  const { isFavorite, toggleFavoritePokemon } = useFavorites();
  const favorited = isFavorite(pokemonId);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    e.preventDefault(); // Prevent navigation if in a link
    toggleFavoritePokemon(pokemonId, pokemon);
  };
  
  return (
    <FavoriteButtonContainer
      className={className}
      isFavorite={favorited}
      viewMode={viewMode}
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon 
        isFavorite={favorited}
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </HeartIcon>
    </FavoriteButtonContainer>
  );
};

export default FavoriteButton; 