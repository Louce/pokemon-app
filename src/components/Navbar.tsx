import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// Main navbar container
const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, var(--primary-color), #6d278a);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 15%),
      radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 20%);
    z-index: -1;
  }

  .dark-mode & {
    background: linear-gradient(90deg, #3d2953, #2d1b3e);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

// Logo styling
const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 15px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 1.7rem;
    gap: 10px;
  }
  
  &:hover {
    color: white;
    transform: translateY(-2px);
    
    img {
      transform: rotate(15deg) scale(1.1);
    }
  }
  
  .text-accent {
    color: var(--secondary-color);
    transition: color 0.3s ease;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--secondary-color);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
  
  &:hover .text-accent::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  img {
    height: 45px;
    width: auto;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    animation: floatBall 3s ease-in-out infinite;
    transition: transform 0.3s ease;
    
    @media (max-width: 768px) {
      height: 35px;
    }
  }
  
  @keyframes floatBall {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-5px) rotate(10deg); }
  }
`;

// Desktop navigation container
const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Theme toggle button for desktop
const ThemeToggleDesktop = styled.button`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  font-weight: 600;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  .icon {
    font-size: 1.3rem;
    transition: transform 0.4s ease;
  }
  
  &:hover .icon {
    transform: rotate(30deg) scale(1.2);
  }
  
  .dark-mode & {
    border-color: rgba(79, 193, 166, 0.4);
    
    &:hover {
      border-color: rgba(79, 193, 166, 0.7);
    }
  }
`;

// Mobile navigation container
const MobileNav = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    width: 75%;
    max-width: 280px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.97);
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
    padding: 40px 20px;
    z-index: 999;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'};
    
    .dark-mode & {
      background: rgba(26, 26, 46, 0.97);
      box-shadow: -5px 0 30px rgba(0, 0, 0, 0.4);
    }
  }
`;

// Overlay for mobile menu
const MobileOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    z-index: 998;
    transition: opacity 0.3s ease;
    opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  }
`;

// Mobile Pokemon logo
const MobilePokemonLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  
  img {
    width: 80px;
    height: auto;
    margin-bottom: 15px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
  
  .title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    
    .dark-mode & {
      color: #fff;
    }
    
    .accent {
      color: var(--primary-color);
      
      .dark-mode & {
        color: var(--secondary-color);
      }
    }
  }
`;

// Navigation links container
const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

// Navigation link
const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  .dark-mode & {
    color: #fff;
  }
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.1);
    transform: translateX(5px);
    
    .dark-mode & {
      background: rgba(var(--secondary-color-rgb), 0.1);
    }
  }
  
  .icon {
    margin-right: 12px;
    font-size: 1.3rem;
    opacity: 0.8;
  }
`;

// Mobile theme toggle in sidebar
const MobileThemeToggleSidebar = styled.button`
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 30px;
  font-weight: 500;
  
  .dark-mode & {
    background: #2a2a40;
    color: white;
  }
  
  &:hover {
    background: #ebebeb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .dark-mode & {
      background: #32324d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
  
  .icon {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }
  
  &:hover .icon {
    transform: rotate(15deg);
  }
`;

// Mobile theme toggle button that appears in the navbar
const MobileThemeToggle = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  width: 38px;
  height: 38px;
  margin-right: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dark-mode & {
    border-color: rgba(79, 193, 166, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    
    &:hover {
      border-color: rgba(79, 193, 166, 0.7);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    }
  }
`;

// Mobile menu button
const MenuToggle = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .dark-mode & {
    border-color: rgba(79, 193, 166, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    
    &:hover {
      border-color: rgba(79, 193, 166, 0.7);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    }
  }
  
  .bar {
    display: block;
    width: 18px;
    height: 2px;
    margin: 2px 0;
    background-color: white;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
  }
  
  &.open {
    background: rgba(255, 255, 255, 0.25);
  }
  
  &.open .bar:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }
  
  &.open .bar:nth-child(2) {
    opacity: 0;
  }
  
  &.open .bar:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }
`;

// Navbar component
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Toggle theme
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <NavbarContainer>
        <Logo to="/">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="PokéBall" />
          <span>Poké<span className="text-accent">Dex</span></span>
        </Logo>
        
        {/* Desktop Navigation */}
        <DesktopNav>
          <ThemeToggleDesktop onClick={handleThemeToggle}>
            <span className="icon">{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </ThemeToggleDesktop>
        </DesktopNav>
        
        {/* Mobile Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile theme toggle */}
          <MobileThemeToggle onClick={handleThemeToggle} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? '☀️' : '🌙'}
          </MobileThemeToggle>
          
          {/* Mobile Menu Button */}
          <MenuToggle 
            ref={buttonRef}
            onClick={toggleMenu} 
            className={isMenuOpen ? 'open' : ''}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </MenuToggle>
        </div>
      </NavbarContainer>
      
      {/* Mobile Navigation */}
      <MobileOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <MobileNav ref={menuRef} isOpen={isMenuOpen}>
        <MobilePokemonLogo>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" />
          <div className="title">Poké<span className="accent">Dex</span></div>
        </MobilePokemonLogo>
        
        <NavLinks>
          <NavLink to="/favorites">
            <span className="icon">⭐</span>
            Favorites
          </NavLink>
          <NavLink to="/types">
            <span className="icon">🔠</span>
            Types
          </NavLink>
          <NavLink to="/about">
            <span className="icon">ℹ️</span>
            About
          </NavLink>
        </NavLinks>
        
        <MobileThemeToggleSidebar onClick={handleThemeToggle}>
          <span className="icon">{darkMode ? '☀️' : '🌙'}</span>
          <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
        </MobileThemeToggleSidebar>
      </MobileNav>
    </>
  );
};

export default Navbar; 