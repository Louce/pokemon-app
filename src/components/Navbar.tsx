import React, { useState, useEffect, useRef } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import LoginModal from './LoginModal';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

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
    transition: transform 0.3s ease;
    
    @media (max-width: 768px) {
      height: 35px;
    }
  }
`;

// Desktop navigation container
const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Navigation links
const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);
    
    &::before {
      transform: scaleY(1);
    }
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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

// User controls container
const UserControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

// Login/logout button
const AuthButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.1rem;
  }
`;

// User profile container
const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  position: relative;
  padding: 5px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .username {
    font-weight: 600;
  }
  
  .icon {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
  }
  
  &:hover .icon {
    transform: rotate(180deg);
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

// Mobile menu link styling
const MobileNavLink = styled(Link)`
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-light);
  text-decoration: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  &:hover {
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }
  
  .nav-icon {
    margin-right: 15px;
    font-size: 1.3rem;
  }
  
  .badge {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    background: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }
`;

const MobileUserSection = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 12px;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  
  .dark-mode & {
    background-color: rgba(var(--primary-color-rgb), 0.05);
  }
`;

const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--secondary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 15px;
    color: white;
    font-size: 1.2rem;
  }
  
  .username {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-light);
    
    .dark-mode & {
      color: var(--text-dark);
    }
  }
`;

const MobileAuthButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .button-icon {
    margin-right: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: var(--text-light);
  cursor: pointer;
  z-index: 10;
  
  .dark-mode & {
    color: var(--text-dark);
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

// Navbar component
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  const { darkMode, toggleTheme } = useTheme();
  const { isLoggedIn, currentUser, logoutUser } = useUser();
  const { favorites } = useFavorites();
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Toggle theme
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  // Handle login and logout
  const handleAuthAction = () => {
    if (isLoggedIn) {
      logoutUser();
    } else {
      setIsLoginModalOpen(true);
    }
  };
  
  return (
    <>
      <NavbarContainer>
        <Logo to="/">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Poké Ball" />
          <span>Poké<span className="text-accent">Dex</span></span>
        </Logo>
        
        <DesktopNav>
          <NavLink to="/">Home</NavLink>
          {isLoggedIn && (
            <NavLink to="/favorites">
              Favorites
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </NavLink>
          )}
          
          <UserControls>
            <ThemeToggleDesktop onClick={handleThemeToggle} aria-label="Toggle dark mode">
              <span className="icon">{darkMode ? '🌙' : '☀️'}</span>
              <span>{darkMode ? 'Dark' : 'Light'}</span>
            </ThemeToggleDesktop>
            
            {isLoggedIn ? (
              <UserProfile>
                <div className="avatar">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </div>
                <span className="username">{currentUser?.username}</span>
                <span className="icon">▼</span>
              </UserProfile>
            ) : (
              <AuthButton onClick={handleAuthAction}>
                <span className="icon">👤</span>
                <span>Sign In</span>
              </AuthButton>
            )}
          </UserControls>
        </DesktopNav>
        
        {/* Mobile Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile theme toggle */}
          <MobileThemeToggle onClick={handleThemeToggle} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? '☀️' : '🌙'}
          </MobileThemeToggle>
          
          {/* Mobile Menu Button */}
          <MenuToggle 
            ref={menuButtonRef}
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
      <MobileNav ref={mobileNavRef} isOpen={isMenuOpen}>
        <CloseButton onClick={() => setIsMenuOpen(false)}>×</CloseButton>
        
        {/* Mobile User Section */}
        {isLoggedIn ? (
          <MobileUserSection>
            <MobileUserInfo>
              <div className="avatar">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <div className="username">{currentUser?.username}</div>
            </MobileUserInfo>
            <MobileAuthButton onClick={handleAuthAction}>
              <span className="button-icon">👋</span>
              Sign Out
            </MobileAuthButton>
          </MobileUserSection>
        ) : (
          <MobileUserSection>
            <MobileAuthButton onClick={handleAuthAction}>
              <span className="button-icon">👤</span>
              Sign In
            </MobileAuthButton>
          </MobileUserSection>
        )}
        
        {/* Mobile Navigation Links */}
        <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
          <span className="nav-icon">🏠</span>
          Home
        </MobileNavLink>
        
        {isLoggedIn && (
          <MobileNavLink to="/favorites" onClick={() => setIsMenuOpen(false)}>
            <span className="nav-icon">❤️</span>
            Favorites
            {favorites.length > 0 && (
              <span className="badge">{favorites.length}</span>
            )}
          </MobileNavLink>
        )}
        
        {/* Mobile Theme Toggle */}
        <MobileThemeToggleSidebar onClick={handleThemeToggle}>
          <div className="icon">{darkMode ? '☀️' : '🌙'}</div>
          <div className="text">{darkMode ? 'Light Mode' : 'Dark Mode'}</div>
        </MobileThemeToggleSidebar>
      </MobileNav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar; 