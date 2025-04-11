import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, var(--primary-color), rgba(79, 193, 166, 0.9));
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-speed);
  position: relative;
  z-index: 100;
  overflow: hidden;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at top left, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 5%;
    width: 300px;
    height: 300px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'); /* Pikachu */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right center;
    opacity: 0.08;
    transform: translateY(-50%) translateZ(10px);
    z-index: -1;
    filter: drop-shadow(0 0 15px rgba(247, 208, 44, 0.4));
    animation: navPikachu 15s ease-in-out infinite alternate;
  }
  
  @keyframes navPikachu {
    0%, 100% { transform: translateY(-50%) translateZ(10px); }
    50% { transform: translateY(-55%) translateZ(20px); }
  }

  .dark-mode & {
    background: linear-gradient(90deg, #2C3E50, #1A2639);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    &::after {
      background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'); /* Charizard */
      opacity: 0.1;
      filter: drop-shadow(0 0 20px rgba(255, 93, 62, 0.5));
    }
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -0.03em;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateZ(10px);
  }
  
  .text-accent {
    color: var(--secondary-color);
    display: inline-block;
    position: relative;
    transition: all 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: var(--secondary-color);
      opacity: 0.3;
      filter: blur(8px);
      z-index: -1;
      transition: all 0.3s ease;
      transform: translateZ(-5px);
    }
  }
  
  &:hover .text-accent {
    color: var(--accent-color);
    transform: translateZ(15px);
  }
  
  &:hover .text-accent::after {
    background-color: var(--accent-color);
    opacity: 0.4;
    filter: blur(10px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
    transform: scaleX(0.7);
    opacity: 0.5;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
    opacity: 0.8;
  }

  img {
    height: 45px;
    width: auto;
    transition: all 0.5s ease;
    transform-style: preserve-3d;
    perspective: 1000px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    transform-origin: center;
    animation: rotateBall 15s linear infinite;
  }

  &:hover img {
    animation: rotateBall 4s linear infinite;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
    transform: scale(1.1) translateZ(20px);
  }
  
  @keyframes rotateBall {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .dark-mode & {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    
    .text-accent {
      color: var(--accent-color);
      
      &::after {
        background-color: var(--accent-color);
      }
    }
    
    &:hover .text-accent {
      color: var(--secondary-color);
    }
    
    &:hover .text-accent::after {
      background-color: var(--secondary-color);
    }
    
    img {
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
    }
  }
`;

const NavItems = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    width: 280px;
    height: 100vh;
    padding: 2rem 1rem;
    transition: right 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 100;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
    transform-style: preserve-3d;
    
    .dark-mode & {
      background: rgba(28, 40, 59, 0.95);
      box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-speed);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1);
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
    transform: skewX(-25deg);
  }

  &:hover::before {
    left: 150%;
  }

  &:focus-within {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.2);
    transform: translateY(-3px) translateZ(10px);
  }

  .dark-mode & {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(79, 193, 166, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:focus-within {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(79, 193, 166, 0.5);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 193, 166, 0.2);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(79, 193, 166, 0.3);
    
    .dark-mode & {
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(79, 193, 166, 0.2);
    }
  }
`;

const PokeballIcon = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  transform-style: preserve-3d;
  transform: translateZ(5px);
  transition: all 0.3s ease;
  
  ${SearchForm}:focus-within & {
    transform: translateZ(15px) rotate(360deg);
  }

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  &::before {
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    background-color: var(--accent-color);
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px rgba(255, 93, 62, 0.4);
  }

  &::after {
    bottom: 0;
    left: 0;
    right: 0;
    height: 12px;
    background-color: white;
    border: 2px solid var(--accent-color);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }

  ${SearchForm}:focus-within &::before {
    transform: translateY(2px);
    box-shadow: 0 0 15px rgba(255, 93, 62, 0.6);
  }

  ${SearchForm}:focus-within &::after {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  }
  
  .dark-mode &::before {
    background-color: var(--secondary-color);
    box-shadow: 0 0 10px rgba(247, 208, 44, 0.4);
  }
  
  .dark-mode &::after {
    border-color: var(--secondary-color);
  }
`;

const SearchDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  border: 2px solid var(--accent-color);
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  
  .dark-mode & {
    border-color: var(--secondary-color);
    box-shadow: 0 0 10px rgba(247, 208, 44, 0.4);
  }
  
  ${SearchForm}:focus-within & {
    background-color: var(--accent-color);
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 15px rgba(255, 93, 62, 0.6);
  }
  
  .dark-mode ${SearchForm}:focus-within & {
    background-color: var(--secondary-color);
    box-shadow: 0 0 15px rgba(247, 208, 44, 0.6);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  padding: 8px;
  width: 200px;
  font-weight: 500;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.3s ease;
  }
  
  &:focus {
    outline: none;
  }

  &:focus::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .dark-mode & {
    color: var(--text-dark);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    color: var(--text-light);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .dark-mode & {
      color: var(--text-dark);
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px) translateZ(5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .icon {
    font-size: 1.2rem;
    transition: all 0.5s ease;
    transform-style: preserve-3d;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4));
  }
  
  &:hover .icon {
    transform: rotate(360deg) translateZ(10px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  }

  .dark-mode & {
    border-color: rgba(79, 193, 166, 0.4);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .dark-mode &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(79, 193, 166, 0.6);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: 768px) {
    color: var(--text-light);
    border-color: rgba(79, 193, 166, 0.4);
    background: transparent;
    
    .dark-mode & {
      color: white;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  color: white;
  font-size: 1.8rem;
  padding: 5px;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: transparent;
    transform: rotate(90deg);
    color: var(--accent-color);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.nav-items')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <NavbarContainer>
      <Logo to="/">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="PokéTrainer" />
        <span>Poké<span className="text-accent">Dex</span></span>
      </Logo>
      
      <MenuButton onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </MenuButton>
      
      <NavItems isOpen={isMenuOpen} className="nav-items">
        <SearchForm onSubmit={handleSearch}>
          <PokeballIcon>
            <SearchDot />
          </PokeballIcon>
          <SearchInput
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </SearchForm>
        
        <ThemeToggle onClick={toggleTheme}>
          <span className="icon">{darkMode ? '☀️' : '🌙'}</span>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </ThemeToggle>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar; 