import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PokemonDetail } from '../services/pokemonService';
import { useTheme } from '../contexts/ThemeContext';

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

const Card = styled(Link)`
  background-color: var(--card-bg-light);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-light);
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  height: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  transform-style: preserve-3d;
  perspective: 1000px;
  will-change: transform, box-shadow;
  
  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 15px 30px rgba(76, 175, 80, 0.15), 0 5px 15px rgba(0, 0, 0, 0.07);
    border-color: var(--primary-color);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: linear-gradient(to bottom, rgba(139, 195, 74, 0.1), transparent);
    transition: height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nest-ball.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.07;
    transform: rotate(-15deg);
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 0;
  }
  
  &:hover::before {
    height: 100%;
  }

  &:hover::after {
    transform: rotate(0deg) scale(1.2);
    opacity: 0.12;
  }

  .dark-mode & {
    background-color: var(--card-bg-dark);
    color: var(--text-dark);
    box-shadow: var(--card-shadow-dark);
    
    &::before {
      background: linear-gradient(to bottom, rgba(79, 193, 166, 0.1), transparent);
    }
    
    &::after {
      background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png');
    }
    
    &:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 15px rgba(79, 193, 166, 0.2);
      border-color: var(--primary-color);
    }
  }
`;

const PokemonImage = styled.div`
  width: 170px;
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79, 193, 166, 0.3) 0%, rgba(79, 193, 166, 0) 70%);
    transform: translate(-50%, -50%);
    z-index: -1;
    opacity: 0.7;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.03);
    transform: translate(-50%, -50%);
    z-index: -1;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
    z-index: 2;
    will-change: transform, filter;
  }

  ${Card}:hover & {
    transform: translateZ(20px);
  }

  ${Card}:hover & img {
    transform: scale(1.15);
    filter: drop-shadow(0 10px 15px rgba(79, 193, 166, 0.2));
    animation: spring 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  
  ${Card}:hover &::before {
    width: 160px;
    height: 160px;
    opacity: 0.9;
    background: radial-gradient(circle, rgba(79, 193, 166, 0.3) 0%, rgba(79, 193, 166, 0) 70%);
  }
  
  ${Card}:hover &::after {
    width: 150px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.05);
    filter: blur(5px);
  }
  
  .dark-mode ${Card} &::before {
    background: radial-gradient(circle, rgba(79, 193, 166, 0.3) 0%, rgba(79, 193, 166, 0) 70%);
  }
  
  .dark-mode ${Card} &::after {
    background-color: rgba(255, 255, 255, 0.03);
  }
  
  .dark-mode ${Card}:hover &::after {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .dark-mode ${Card} & img {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) brightness(1.05);
  }
  
  .dark-mode ${Card}:hover & img {
    filter: drop-shadow(0 10px 20px rgba(79, 193, 166, 0.4)) brightness(1.1);
  }
`;

const PokemonId = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--accent-color);
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  ${Card}:hover & {
    transform: translateY(-3px) translateZ(15px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    animation: pulse 2s infinite;
  }
  
  .dark-mode & {
    background-color: var(--accent-color);
    color: white;
    box-shadow: 0 2px 10px rgba(255, 93, 62, 0.3);
  }
`;

const PokemonName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.4rem;
  text-transform: capitalize;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -0.01em;
  transform-style: preserve-3d;
  
  ${Card}:hover & {
    color: var(--primary-color);
    transform: translateZ(15px);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .dark-mode ${Card}:hover & {
    color: var(--primary-color);
    text-shadow: 2px 2px 8px rgba(79, 193, 166, 0.2);
  }
`;

const TypesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;
  
  ${Card}:hover & {
    transform: translateZ(10px);
  }
`;

const TypeBadge = styled.span`
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.9rem;
  text-transform: capitalize;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
  transform-style: preserve-3d;
  
  ${Card}:hover & {
    transform: translateY(-3px) translateZ(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:nth-child(odd) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(1) {
    transition-delay: 0.05s;
  }
  
  &:nth-child(2) {
    transition-delay: 0.1s;
  }
  
  .dark-mode & {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode ${Card}:hover & {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

// Type colors for badges with better contrast
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
  fairy: '#ED91E6',
  default: '#777'
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { darkMode } = useTheme();
  
  return (
    <Card to={`/pokemon/${pokemon.id}`}>
      <PokemonId>#{pokemon.id.toString().padStart(3, '0')}</PokemonId>
      <PokemonImage>
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
          alt={pokemon.name}
        />
      </PokemonImage>
      <PokemonName>{pokemon.name}</PokemonName>
      <TypesContainer>
        {pokemon.types.map((typeInfo) => (
          <TypeBadge 
            key={typeInfo.type.name}
            style={{ 
              backgroundColor: darkMode ? '#1A237E' : typeColors[typeInfo.type.name] || typeColors.default,
              color: darkMode 
                ? typeColors[typeInfo.type.name] || typeColors.default 
                : ['electric', 'normal', 'ground'].includes(typeInfo.type.name) ? '#333' : '#fff'
            }}
          >
            {typeInfo.type.name}
          </TypeBadge>
        ))}
      </TypesContainer>
    </Card>
  );
};

export default PokemonCard; 