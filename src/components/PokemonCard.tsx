import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PokemonDetail } from '../services/pokemonService';
import { useTheme } from '../contexts/ThemeContext';
import { typeColors, getBackgroundColorByType } from '../utils/typeColors';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  viewMode?: 'list' | 'grid';
}

// Helper function to determine if a color is light or dark
const isColorLight = (color: string): boolean => {
  // For hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }
  
  // For rgb/rgba colors
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const [r, g, b] = rgbMatch.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    }
  }
  
  // For gradient backgrounds, default to false (assuming darker)
  return false;
};

const Card = styled(Link)<{ 
  viewMode?: 'list' | 'grid'; 
  bgColor: string; 
  textColor: string; 
  isLight: boolean;
  isDarkMode: boolean;
}>`
  background: ${props => props.isDarkMode 
    ? `linear-gradient(135deg, rgba(25, 25, 28, 0.95) 0%, rgba(18, 18, 20, 0.98) 100%)` 
    : props.bgColor};
  border-radius: 24px;
  box-shadow: ${props => props.isDarkMode 
    ? '0 10px 25px rgba(0, 0, 0, 0.25)' 
    : '0 10px 25px rgba(0, 0, 0, 0.12)'};
  padding: ${props => props.viewMode === 'grid' ? '25px 20px' : '30px'};
  display: flex;
  flex-direction: ${props => props.viewMode === 'grid' ? 'column' : 'column'};
  align-items: center;
  text-decoration: none;
  color: ${props => props.isDarkMode ? 'rgba(235, 235, 240, 0.9)' : props.textColor};
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid ${props => props.isDarkMode 
    ? 'rgba(40, 40, 45, 0.5)' 
    : props.isLight 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.2)'};
  transform-style: preserve-3d;
  perspective: 1000px;
  will-change: transform, box-shadow;
  border-radius: 24px;
  
  @media (max-width: 768px) {
    padding: ${props => props.viewMode === 'list' ? '20px' : '15px 15px'};
    flex-direction: ${props => props.viewMode === 'list' ? 'row' : 'column'};
    align-items: ${props => props.viewMode === 'list' ? 'flex-start' : 'center'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.viewMode === 'list' ? '15px' : '10px'};
    border-radius: 16px;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${props => props.isDarkMode 
      ? '0 20px 40px rgba(0, 0, 0, 0.35)' 
      : `0 20px 35px ${props.isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)'}`};
      
    @media (max-width: 768px) {
      transform: translateY(-5px) scale(1.01);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(135deg, rgba(35, 35, 40, 0.1) 0%, rgba(20, 20, 22, 0) 100%)' 
      : `linear-gradient(135deg, 
          ${props.isLight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)'} 0%, 
          ${props.isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)'} 100%)`};
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: -30px;
    width: 130px;
    height: 130px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: ${props => props.isDarkMode ? '0.08' : props.isLight ? '0.1' : '0.15'};
    filter: brightness(${props => props.isDarkMode ? '0.7' : props.isLight ? '1' : '2'});
    transform: rotate(0deg);
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 0;
  }
  
  &:hover::after {
    transform: rotate(15deg) scale(1.2);
    opacity: ${props => props.isDarkMode ? '0.1' : props.isLight ? '0.15' : '0.2'};
  }
`;

const PokemonImage = styled.div<{ viewMode?: 'list' | 'grid'; isDarkMode: boolean }>`
  width: ${props => props.viewMode === 'grid' ? '150px' : '200px'};
  height: ${props => props.viewMode === 'grid' ? '150px' : '200px'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.viewMode === 'grid' ? '20px' : '20px'};
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  @media (max-width: 768px) {
    width: ${props => props.viewMode === 'grid' ? '130px' : '120px'};
    height: ${props => props.viewMode === 'grid' ? '130px' : '120px'};
    margin-bottom: ${props => props.viewMode === 'list' ? '0' : '15px'};
    margin-right: ${props => props.viewMode === 'list' ? '15px' : '0'};
  }
  
  @media (max-width: 480px) {
    width: ${props => props.viewMode === 'grid' ? '100px' : '90px'};
    height: ${props => props.viewMode === 'grid' ? '100px' : '90px'};
    margin-right: ${props => props.viewMode === 'list' ? '10px' : '0'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${props => props.viewMode === 'grid' ? '130px' : '170px'};
    height: ${props => props.viewMode === 'grid' ? '130px' : '170px'};
    border-radius: 50%;
    background: ${props => props.isDarkMode 
      ? 'rgba(45, 45, 50, 0.25)' 
      : 'rgba(255, 255, 255, 0.25)'};
    transform: translate(-50%, -50%);
    z-index: -1;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    
    @media (max-width: 768px) {
      width: ${props => props.viewMode === 'grid' ? '100px' : '140px'};
      height: ${props => props.viewMode === 'grid' ? '100px' : '140px'};
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    filter: ${props => props.isDarkMode 
      ? 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3)) brightness(0.9)' 
      : 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.25))'};
    z-index: 2;
    will-change: transform;
    transform: translateY(0) scale(1.0);
  }

  ${Card}:hover & img {
    transform: scale(1.18) translateY(-8px);
    filter: ${props => props.isDarkMode 
      ? 'drop-shadow(0 15px 20px rgba(0, 0, 0, 0.4)) brightness(0.9)' 
      : 'drop-shadow(0 15px 20px rgba(0, 0, 0, 0.3))'};
  }
  
  ${Card}:hover &::before {
    width: ${props => props.viewMode === 'grid' ? '140px' : '180px'};
    height: ${props => props.viewMode === 'grid' ? '140px' : '180px'};
    opacity: 0.5;
    
    @media (max-width: 768px) {
      width: ${props => props.viewMode === 'grid' ? '110px' : '150px'};
      height: ${props => props.viewMode === 'grid' ? '110px' : '150px'};
    }
  }
`;

const PokemonId = styled.span<{ 
  viewMode?: 'list' | 'grid'; 
  isLight: boolean;
  isDarkMode: boolean; 
}>`
  position: absolute;
  top: 18px;
  right: 18px;
  background-color: ${props => props.isDarkMode
    ? 'rgba(35, 35, 40, 0.7)'
    : props.isLight 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.35)'};
  color: inherit;
  padding: ${props => props.viewMode === 'grid' ? '6px 12px' : '8px 16px'};
  border-radius: 30px;
  font-size: ${props => props.viewMode === 'grid' ? '0.9rem' : '1rem'};
  font-weight: 700;
  z-index: 2;
  backdrop-filter: blur(5px);
  box-shadow: ${props => props.isDarkMode 
    ? '0 2px 10px rgba(0, 0, 0, 0.2)'
    : '0 2px 10px rgba(0, 0, 0, 0.15)'};
  
  @media (max-width: 480px) {
    padding: ${props => props.viewMode === 'grid' ? '4px 10px' : '6px 12px'};
    font-size: ${props => props.viewMode === 'grid' ? '0.8rem' : '0.9rem'};
    top: 12px;
    right: 12px;
  }
`;

const InfoContainer = styled.div<{ viewMode?: 'list' | 'grid' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: ${props => props.viewMode === 'grid' ? 'center' : 'center'};
  z-index: 1;
  width: 100%;
  
  @media (max-width: 768px) {
    text-align: ${props => props.viewMode === 'list' ? 'left' : 'center'};
  }
`;

const PokemonName = styled.h3<{ viewMode?: 'list' | 'grid'; isDarkMode: boolean }>`
  margin: 0 0 12px;
  font-size: ${props => props.viewMode === 'grid' ? '1.3rem' : '1.8rem'};
  font-weight: 800;
  text-transform: capitalize;
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
  opacity: ${props => props.isDarkMode ? '0.9' : '1'};
  
  @media (max-width: 768px) {
    font-size: ${props => props.viewMode === 'grid' ? '1.2rem' : '1.3rem'};
    margin-bottom: ${props => props.viewMode === 'grid' ? '10px' : '8px'};
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.viewMode === 'grid' ? '1.1rem' : '1.2rem'};
    margin-bottom: ${props => props.viewMode === 'grid' ? '8px' : '5px'};
  }
`;

const PokemonTypes = styled.div<{ viewMode?: 'list' | 'grid' }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: ${props => props.viewMode === 'grid' ? '8px' : '12px'};
  justify-content: ${props => props.viewMode === 'grid' ? 'center' : 'center'};
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-top: ${props => props.viewMode === 'grid' ? '5px' : '5px'};
    justify-content: ${props => props.viewMode === 'list' ? 'flex-start' : 'center'};
  }
  
  @media (max-width: 480px) {
    gap: 5px;
    margin-top: 3px;
  }
`;

const PokemonType = styled.span<{ 
  viewMode?: 'list' | 'grid'; 
  typeColor: string;
  isLight: boolean;
  isDarkMode: boolean;
}>`
  background-color: ${props => props.isDarkMode
    ? 'rgba(40, 40, 45, 0.6)'
    : props.isLight 
      ? `rgba(0, 0, 0, 0.08)` 
      : `${props.typeColor}90`
  };
  color: ${props => props.isDarkMode ? 'rgba(235, 235, 240, 0.9)' : '#fff'};
  padding: ${props => props.viewMode === 'grid' ? '6px 12px' : '8px 16px'};
  border-radius: 30px;
  font-size: ${props => props.viewMode === 'grid' ? '0.85rem' : '0.95rem'};
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: ${props => props.isDarkMode
    ? '0 3px 10px rgba(0, 0, 0, 0.15)'
    : '0 3px 10px rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode
    ? 'rgba(55, 55, 60, 0.5)'
    : props.isLight 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.3)'
  };
  
  @media (max-width: 768px) {
    padding: ${props => props.viewMode === 'grid' ? '5px 10px' : '6px 12px'};
    font-size: ${props => props.viewMode === 'grid' ? '0.75rem' : '0.8rem'};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.viewMode === 'grid' ? '4px 8px' : '4px 10px'};
    font-size: ${props => props.viewMode === 'grid' ? '0.7rem' : '0.75rem'};
    border-radius: 20px;
  }
  
  ${Card}:hover & {
    background-color: ${props => props.isDarkMode
      ? 'rgba(50, 50, 55, 0.7)'
      : props.isLight 
        ? `rgba(0, 0, 0, 0.12)` 
        : `${props.typeColor}`
    };
    box-shadow: ${props => props.isDarkMode
      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
      : '0 4px 12px rgba(0, 0, 0, 0.15)'};
    transform: translateY(-2px);
  }
`;

const StatContainer = styled.div<{ viewMode?: 'list' | 'grid' }>`
  display: ${props => props.viewMode === 'grid' ? 'none' : 'flex'};
  gap: 20px;
  margin-top: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 5;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 12px;
    justify-content: flex-start;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 10px;
  }
`;

const StatItem = styled.div<{ 
  isLight: boolean;
  isDarkMode: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: ${props => props.isDarkMode
    ? 'rgba(35, 35, 40, 0.6)'
    : props.isLight 
      ? 'rgba(0, 0, 0, 0.1)' 
      : 'rgba(255, 255, 255, 0.25)'
  };
  padding: 8px 16px;
  border-radius: 16px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.isDarkMode
    ? 'rgba(50, 50, 55, 0.5)'
    : props.isLight 
      ? 'rgba(0, 0, 0, 0.05)' 
      : 'rgba(255, 255, 255, 0.2)'
  };
  z-index: 5;
  
  ${Card}:hover & {
    transform: translateY(-2px);
    background: ${props => props.isDarkMode
      ? 'rgba(40, 40, 45, 0.7)'
      : props.isLight 
        ? 'rgba(0, 0, 0, 0.15)' 
        : 'rgba(255, 255, 255, 0.3)'
    };
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 4px 10px;
    border-radius: 10px;
  }
`;

const StatLabel = styled.span<{ isDarkMode: boolean }>`
  font-size: 0.8rem;
  color: inherit;
  opacity: ${props => props.isDarkMode ? '0.8' : '0.9'};
  margin-bottom: 5px;
  font-weight: 500;
  text-transform: capitalize;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 3px;
  }
`;

const StatValue = styled.span<{ isDarkMode: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: inherit;
  position: relative;
  opacity: ${props => props.isDarkMode ? '0.9' : '1'};
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, viewMode = 'list' }) => {
  const { darkMode } = useTheme();
  
  // Get main stats to display
  const hp = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
  const attack = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  const defense = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
  
  // Get the primary type for background color
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const bgColor = getBackgroundColorByType(primaryType);
  const typeHexColor = typeColors[primaryType] || typeColors.normal;
  const textColor = '#ffffff';
  
  // Check if background color is light or dark
  const isLight = isColorLight(typeHexColor);
  
  return (
    <Card 
      to={`/pokemon/${pokemon.id}`} 
      viewMode={viewMode}
      bgColor={bgColor}
      textColor={textColor}
      isLight={isLight}
      isDarkMode={darkMode}
    >
      <PokemonId 
        viewMode={viewMode} 
        isLight={isLight}
        isDarkMode={darkMode}
      >
        #{pokemon.id.toString().padStart(3, '0')}
      </PokemonId>
      
      <PokemonImage 
        viewMode={viewMode}
        isDarkMode={darkMode}
      >
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
        />
      </PokemonImage>
      
      <InfoContainer viewMode={viewMode}>
        <PokemonName 
          viewMode={viewMode}
          isDarkMode={darkMode}
        >
          {pokemon.name}
        </PokemonName>
        
        <PokemonTypes viewMode={viewMode}>
          {pokemon.types.map(typeInfo => (
            <PokemonType 
              key={typeInfo.type.name}
              viewMode={viewMode}
              typeColor={typeColors[typeInfo.type.name] || typeColors.normal}
              isLight={isColorLight(typeColors[typeInfo.type.name] || typeColors.normal)}
              isDarkMode={darkMode}
            >
              {typeInfo.type.name}
            </PokemonType>
          ))}
        </PokemonTypes>
        
        {viewMode === 'list' && (
          <StatContainer viewMode={viewMode}>
            <StatItem 
              isLight={isLight}
              isDarkMode={darkMode}
            >
              <StatLabel isDarkMode={darkMode}>HP</StatLabel>
              <StatValue isDarkMode={darkMode}>{hp}</StatValue>
            </StatItem>
            
            <StatItem 
              isLight={isLight}
              isDarkMode={darkMode}
            >
              <StatLabel isDarkMode={darkMode}>Attack</StatLabel>
              <StatValue isDarkMode={darkMode}>{attack}</StatValue>
            </StatItem>
            
            <StatItem 
              isLight={isLight}
              isDarkMode={darkMode}
            >
              <StatLabel isDarkMode={darkMode}>Defense</StatLabel>
              <StatValue isDarkMode={darkMode}>{defense}</StatValue>
            </StatItem>
          </StatContainer>
        )}
      </InfoContainer>
    </Card>
  );
};

export default PokemonCard; 