import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import Loading from '../components/Loading';

// Pokemon type colors
const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  default: '#777777'
};

// Stat colors for the bars
const statColors = {
  hp: '#FF5959',
  attack: '#F08030',
  defense: '#6890F0',
  'special-attack': '#F85888',
  'special-defense': '#78C850',
  speed: '#F8D030'
};

const DetailsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: var(--accent-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '←';
    margin-right: 10px;
    font-size: 1.2rem;
  }
`;

const PokemonCard = styled(motion.div)<{ typeColor: string }>`
  background: linear-gradient(135deg, ${props => props.typeColor}33 0%, ${props => props.typeColor} 100%);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 30px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 210px;
    height: 210px;
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='100' fill='%23ffffff' opacity='0.15'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    z-index: 0;
  }
  
  .dark-mode & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const PokemonHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PokemonImage = styled(motion.div)`
  width: 220px;
  height: 220px;
  margin-bottom: 20px;
  position: relative;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    margin-right: 40px;
    margin-bottom: 0;
  }
`;

const PokemonInfo = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const PokemonName = styled.h1`
  color: #fff;
  text-transform: capitalize;
  margin-bottom: 10px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PokemonId = styled.span`
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
  backdrop-filter: blur(5px);
`;

const TypesContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 16px 0;
  flex-wrap: wrap;
`;

const TypeBadge = styled.span`
  padding: 8px 16px;
  border-radius: 30px;
  color: white;
  font-weight: 500;
  text-transform: capitalize;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Badge = styled.span`
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(5px);
`;

const SectionTitle = styled.h2`
  color: #fff;
  margin: 30px 0 15px;
  font-size: 1.5rem;
  position: relative;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 60px;
    height: 3px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }
`;

const Description = styled.p`
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 1.1rem;
  max-width: 800px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const InfoItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 16px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoLabel = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.p`
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
`;

const StatBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

const StatName = styled.div`
  width: 130px;
  text-transform: capitalize;
  color: #fff;
  font-size: 0.9rem;
`;

const StatBarContainer = styled.div`
  flex: 1;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ value: number; color: string }>`
  height: 100%;
  width: ${props => Math.min(100, props.value / 2)}%;
  background-color: ${props => props.color};
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const StatValue = styled.div`
  width: 40px;
  color: #fff;
  font-weight: 600;
  text-align: right;
`;

const AbilitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const AbilityItem = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 30px;
  text-transform: capitalize;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 16px;
  border-radius: var(--border-radius);
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  margin: 20px 0;
`;

const EvolutionChainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  
  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const EvolutionStage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const EvolutionImage = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
`;

const EvolutionName = styled(Link)`
  color: white;
  text-transform: capitalize;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EvolutionDetail = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
`;

const EvolutionArrow = styled.div`
  font-size: 1.5rem;
  color: white;
  margin: 0 10px;
`;

// Helper functions
const getEnglishDescription = (species: any) => {
  if (!species || !species.flavor_text_entries || species.flavor_text_entries.length === 0) {
    return null;
  }
  
  const englishEntries = species.flavor_text_entries.filter(
    (entry: any) => entry.language.name === 'en'
  );
  
  if (englishEntries.length > 0) {
    // Return the most recent English entry and clean up formatting
    return englishEntries[0].flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
  }
  
  return null;
};

const getEnglishGenus = (species: any) => {
  if (!species || !species.genera || species.genera.length === 0) {
    return null;
  }
  
  const englishGenus = species.genera.find((g: any) => g.language.name === 'en');
  return englishGenus ? englishGenus.genus : null;
};

const PokemonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pokemon, species, evolutionChain, loading, error } = usePokemonDetail(id);
  
  if (loading) {
    return <Loading message="Loading Pokémon details..." />;
  }
  
  if (error) {
    return (
      <DetailsContainer>
        <BackButton to="/">Back to Pokémon List</BackButton>
        <ErrorMessage>
          {error.message || 'Failed to load Pokémon details'}
        </ErrorMessage>
      </DetailsContainer>
    );
  }
  
  if (!pokemon) {
    return (
      <DetailsContainer>
        <BackButton to="/">Back to Pokémon List</BackButton>
        <ErrorMessage>Pokémon not found</ErrorMessage>
      </DetailsContainer>
    );
  }
  
  const pokemonDescription = getEnglishDescription(species);
  const pokemonGenus = getEnglishGenus(species);
  
  // Default fallback image for Pokemon sprites
  const fallbackPokemonImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
  
  // Get primary type color for the card background
  const primaryType = pokemon.types[0]?.type.name || 'default';
  const typeColor = typeColors[primaryType as keyof typeof typeColors] || typeColors.default;
  
  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.2, 0.8, 0.2, 1]
      }
    }
  };
  
  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3,
        duration: 0.8,
        ease: [0.2, 0.8, 0.2, 1]
      }
    },
    hover: { 
      y: -10,
      scale: 1.05,
      transition: { 
        duration: 0.5,
        ease: [0.2, 0.8, 0.2, 1],
        yoyo: Infinity,
        repeatDelay: 0.5
      }
    }
  };
  
  return (
    <DetailsContainer>
      <BackButton to="/">Back to Pokémon List</BackButton>
      
      <PokemonCard 
        typeColor={typeColor}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <PokemonHeader>
          <PokemonImage
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
            />
          </PokemonImage>
          
          <PokemonInfo>
            <PokemonName>
              {pokemon.name}
              {species?.is_legendary && <Badge>Legendary</Badge>}
              {species?.is_mythical && <Badge>Mythical</Badge>}
            </PokemonName>
            <PokemonId>#{pokemon.id.toString().padStart(3, '0')}</PokemonId>
            {pokemonGenus && <p style={{ color: 'white', fontSize: '1.1rem' }}>{pokemonGenus}</p>}
            
            <TypesContainer>
              {pokemon.types.map(typeInfo => (
                <TypeBadge
                  key={typeInfo.type.name}
                  style={{ backgroundColor: `${typeColors[typeInfo.type.name as keyof typeof typeColors] || typeColors.default}` }}
                >
                  {typeInfo.type.name}
                </TypeBadge>
              ))}
            </TypesContainer>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Height</InfoLabel>
                <InfoValue>{(pokemon.height / 10).toFixed(1)} m</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Weight</InfoLabel>
                <InfoValue>{(pokemon.weight / 10).toFixed(1)} kg</InfoValue>
              </InfoItem>
              
              {species?.habitat && (
                <InfoItem>
                  <InfoLabel>Habitat</InfoLabel>
                  <InfoValue style={{ textTransform: 'capitalize' }}>{species.habitat.name}</InfoValue>
                </InfoItem>
              )}
              
              {species?.color && (
                <InfoItem>
                  <InfoLabel>Color</InfoLabel>
                  <InfoValue style={{ textTransform: 'capitalize' }}>{species.color.name}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </PokemonInfo>
        </PokemonHeader>
        
        {pokemonDescription && (
          <>
            <SectionTitle>Description</SectionTitle>
            <Description>{pokemonDescription}</Description>
          </>
        )}
        
        <SectionTitle>Stats</SectionTitle>
        {pokemon.stats.map(stat => (
          <StatBar key={stat.stat.name}>
            <StatName>{stat.stat.name.replace('-', ' ')}</StatName>
            <StatBarContainer>
              <StatBarFill
                value={stat.base_stat}
                color={statColors[stat.stat.name as keyof typeof statColors] || '#fff'}
              />
            </StatBarContainer>
            <StatValue>{stat.base_stat}</StatValue>
          </StatBar>
        ))}
        
        <SectionTitle>Abilities</SectionTitle>
        <AbilitiesList>
          {pokemon.abilities.map(abilityInfo => (
            <AbilityItem key={abilityInfo.ability.name}>
              {abilityInfo.ability.name.replace('-', ' ')}
              {abilityInfo.is_hidden && ' (Hidden)'}
            </AbilityItem>
          ))}
        </AbilitiesList>
        
        {evolutionChain && evolutionChain.chain && (
          <>
            <SectionTitle>Evolution Chain</SectionTitle>
            <EvolutionChainContainer>
              {/* First evolution (base form) */}
              <EvolutionStage>
                <EvolutionImage>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(evolutionChain.chain.species.url)}.png`}
                    alt={evolutionChain.chain.species.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = fallbackPokemonImage; }}
                  />
                </EvolutionImage>
                <EvolutionName to={`/pokemon/${getIdFromUrl(evolutionChain.chain.species.url)}`}>
                  {evolutionChain.chain.species.name}
                </EvolutionName>
              </EvolutionStage>
              
              {/* Second evolution */}
              {evolutionChain.chain.evolves_to.length > 0 && (
                <>
                  <EvolutionArrow>→</EvolutionArrow>
                  
                  <EvolutionStage>
                    <EvolutionImage>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(evolutionChain.chain.evolves_to[0].species.url)}.png`}
                        alt={evolutionChain.chain.evolves_to[0].species.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackPokemonImage; }}
                      />
                    </EvolutionImage>
                    <EvolutionName to={`/pokemon/${getIdFromUrl(evolutionChain.chain.evolves_to[0].species.url)}`}>
                      {evolutionChain.chain.evolves_to[0].species.name}
                    </EvolutionName>
                    {renderEvolutionDetails(evolutionChain.chain.evolves_to[0].evolution_details[0])}
                  </EvolutionStage>
                  
                  {/* Third evolution */}
                  {evolutionChain.chain.evolves_to[0].evolves_to.length > 0 && (
                    <>
                      <EvolutionArrow>→</EvolutionArrow>
                      
                      <EvolutionStage>
                        <EvolutionImage>
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getIdFromUrl(evolutionChain.chain.evolves_to[0].evolves_to[0].species.url)}.png`}
                            alt={evolutionChain.chain.evolves_to[0].evolves_to[0].species.name}
                            onError={(e) => { (e.target as HTMLImageElement).src = fallbackPokemonImage; }}
                          />
                        </EvolutionImage>
                        <EvolutionName to={`/pokemon/${getIdFromUrl(evolutionChain.chain.evolves_to[0].evolves_to[0].species.url)}`}>
                          {evolutionChain.chain.evolves_to[0].evolves_to[0].species.name}
                        </EvolutionName>
                        {renderEvolutionDetails(evolutionChain.chain.evolves_to[0].evolves_to[0].evolution_details[0])}
                      </EvolutionStage>
                    </>
                  )}
                </>
              )}
            </EvolutionChainContainer>
          </>
        )}
      </PokemonCard>
    </DetailsContainer>
  );
};

// Helper function to extract ID from URL
function getIdFromUrl(url: string): string {
  const matches = url.match(/\/pokemon-species\/(\d+)\//);
  return matches ? matches[1] : '1';
}

// Helper function to render evolution details
function renderEvolutionDetails(details: any): React.ReactNode {
  if (!details) return null;
  
  let evolutionText = '';
  
  if (details.min_level) {
    evolutionText = `Level ${details.min_level}`;
  } else if (details.item) {
    evolutionText = `Use ${details.item.name.replace('-', ' ')}`;
  } else if (details.trigger?.name === 'trade') {
    evolutionText = 'Trade';
  } else if (details.trigger?.name) {
    evolutionText = details.trigger.name.replace('-', ' ');
  }
  
  return evolutionText ? <EvolutionDetail>{evolutionText}</EvolutionDetail> : null;
}

export default PokemonDetails;
