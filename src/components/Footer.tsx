import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const FooterContainer = styled.footer`
  background: linear-gradient(90deg, var(--primary-color), rgba(230, 90, 47, 0.9));
  color: white;
  padding: 40px 24px 30px;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--secondary-color), transparent);
    z-index: 2;
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(247, 208, 44, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 250px;
    height: 250px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'); /* Bulbasaur */
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.08;
    transform: translate(30%, 30%) translateZ(10px) rotate(-5deg);
    z-index: 0;
    filter: drop-shadow(0 0 15px rgba(79, 193, 166, 0.4));
    animation: footerBulbasaur 20s ease-in-out infinite alternate;
  }
  
  @keyframes footerBulbasaur {
    0% { transform: translate(30%, 30%) translateZ(10px) rotate(-5deg); }
    50% { transform: translate(25%, 25%) translateZ(20px) rotate(-2deg); }
    100% { transform: translate(30%, 30%) translateZ(10px) rotate(-5deg); }
  }
  
  .dark-mode & {
    background: linear-gradient(90deg, #2C3E50, #1A2639);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    
    &::before {
      background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
      box-shadow: 0 0 15px rgba(255, 93, 62, 0.5);
    }
    
    &::after {
      background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'); /* Charizard */
      opacity: 0.1;
      filter: drop-shadow(0 0 20px rgba(255, 93, 62, 0.4));
    }
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
`;

const FooterLogo = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -0.02em;
  color: white;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  img {
    height: 35px;
    width: auto;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    animation: rotateBall 15s linear infinite;
    transition: all 0.5s ease;
    transform-style: preserve-3d;
    transform-origin: center;
  }
  
  &:hover {
    transform: translateZ(10px);
  }
  
  &:hover img {
    animation: rotateBall 4s linear infinite;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
    transform: scale(1.1) translateZ(15px);
  }
  
  @keyframes rotateBall {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .text-accent {
    color: var(--secondary-color);
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

const FooterDivider = styled.div`
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, white, transparent);
  margin: 5px auto 20px;
  position: relative;
  opacity: 0.7;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  transform-style: preserve-3d;
  transform: translateZ(5px);
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: var(--secondary-color);
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%) translateZ(10px);
    box-shadow: 0 0 8px rgba(247, 208, 44, 0.6);
    animation: pulse 3s infinite alternate;
  }
  
  &::before {
    left: 25%;
    animation-delay: 0.5s;
  }
  
  &::after {
    right: 25%;
    animation-delay: 1s;
  }
  
  .dark-mode & {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    
    &::before, &::after {
      background-color: var(--accent-color);
      box-shadow: 0 0 8px rgba(255, 93, 62, 0.6);
    }
  }
`;

const FooterText = styled.p`
  font-size: 0.95rem;
  margin: 8px 0;
  max-width: 600px;
  opacity: 0.9;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transform-style: preserve-3d;
  transform: translateZ(5px);
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  margin: 24px 0;
  flex-wrap: wrap;
  justify-content: center;
  transform-style: preserve-3d;
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  position: relative;
  padding: 4px 8px;
  transition: all 0.3s ease;
  z-index: 1;
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--secondary-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    text-decoration: none;
    color: var(--secondary-color);
    transform: translateY(-3px) translateZ(10px);
    text-shadow: 0 0 8px rgba(247, 208, 44, 0.4);
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  .dark-mode & {
    color: white;
  }
  
  .dark-mode &::before {
    background-color: var(--accent-color);
  }
  
  .dark-mode &:hover {
    color: var(--accent-color);
    text-shadow: 0 0 8px rgba(255, 93, 62, 0.4);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  transform-style: preserve-3d;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--secondary-color);
    transform: translateY(-3px) translateZ(10px) scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: var(--secondary-color);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  .dark-mode & {
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .dark-mode &:hover {
    background: rgba(255, 93, 62, 0.15);
    color: var(--accent-color);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--accent-color);
  }
`;

const Copyright = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  transform-style: preserve-3d;
  transform: translateZ(5px);
  
  .heart {
    color: var(--accent-color);
    position: relative;
    
    &::before {
      content: '❤';
      position: absolute;
      top: 0;
      left: 0;
      color: var(--accent-color);
      filter: blur(2px);
      opacity: 0.7;
      animation: pulse 2s infinite;
    }
  }
`;

const PokedexGraphic = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 120px;
  height: 120px;
  opacity: 0.08;
  z-index: 0;
  background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'); /* Squirtle */
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(0 0 15px rgba(79, 193, 166, 0.4));
  animation: squirtleFloat 16s ease-in-out infinite alternate;
  transform-style: preserve-3d;
  
  @keyframes squirtleFloat {
    0% { transform: translateZ(10px) rotate(5deg); }
    50% { transform: translateZ(25px) rotate(0deg); }
    100% { transform: translateZ(10px) rotate(5deg); }
  }
  
  .dark-mode & {
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'); /* Charmander */
    opacity: 0.1;
    filter: drop-shadow(0 0 15px rgba(255, 93, 62, 0.5));
  }
`;

const Footer: React.FC = () => {
  const { darkMode: _darkMode } = useTheme();
  
  return (
    <FooterContainer>
      <PokedexGraphic />
      <FooterContent>
        <FooterLogo>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="PokéDex" />
          <span>Poké<span className="text-accent">Dex</span></span>
        </FooterLogo>
        
        <FooterDivider />
        
        <FooterText>
          Pokémon and Pokémon character names are trademarks of Nintendo.
          This is a demo app created for educational purposes only.
        </FooterText>
        
        <SocialLinks>
          <SocialIcon href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
            <span>🐦</span>
          </SocialIcon>
          <SocialIcon href="#" target="_blank" rel="noopener noreferrer" title="GitHub">
            <span>📂</span>
          </SocialIcon>
          <SocialIcon href="#" target="_blank" rel="noopener noreferrer" title="Discord">
            <span>💬</span>
          </SocialIcon>
        </SocialLinks>
        
        <FooterLinks>
          <FooterLink href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
            PokeAPI
          </FooterLink>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            GitHub Repo
          </FooterLink>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            About
          </FooterLink>
          <FooterLink href="#" target="_blank" rel="noopener noreferrer">
            Contact
          </FooterLink>
        </FooterLinks>
        
        <Copyright>
          <span>&copy; {new Date().getFullYear()} PokéDex</span>
          <span className="heart">❤</span>
          <span>Made with love by Dendi Rivaldi</span>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 