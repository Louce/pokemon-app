import { useState, useEffect } from 'react';
import { 
  getPokemonDetail, 
  getPokemonSpecies, 
  getEvolutionChain,
  getEvolutionChainIdFromUrl,
  PokemonDetail, 
  PokemonSpecies,
  EvolutionChain 
} from '../services/pokemonService';

interface UsePokemonDetailResult {
  pokemon: PokemonDetail | null;
  species: PokemonSpecies | null;
  evolutionChain: EvolutionChain | null;
  loading: boolean;
  error: Error | null;
  fetchPokemon: (idOrName: string | number) => Promise<void>;
}

export const usePokemonDetail = (initialIdOrName?: string | number): UsePokemonDetailResult => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState<boolean>(initialIdOrName !== undefined);
  const [error, setError] = useState<Error | null>(null);

  const fetchPokemon = async (idOrName: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get basic Pokemon data
      const pokemonData = await getPokemonDetail(idOrName);
      setPokemon(pokemonData);
      
      // Get species data
      try {
        const speciesData = await getPokemonSpecies(idOrName);
        setSpecies(speciesData);
        
        // Get evolution chain if available
        if (speciesData.evolution_chain) {
          const evolutionChainId = getEvolutionChainIdFromUrl(speciesData.evolution_chain.url);
          if (evolutionChainId) {
            try {
              const evolutionData = await getEvolutionChain(evolutionChainId);
              setEvolutionChain(evolutionData);
            } catch (evolutionError) {
              console.error('Error fetching evolution chain:', evolutionError);
              // Don't fail the whole request if evolution chain fails
            }
          }
        }
      } catch (speciesError) {
        console.error('Error fetching species data:', speciesError);
        // Don't fail the whole request if species data fails
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch Pokemon with ID/name: ${idOrName}`));
      setPokemon(null);
      setSpecies(null);
      setEvolutionChain(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialIdOrName !== undefined) {
      fetchPokemon(initialIdOrName);
    }
  }, [initialIdOrName]);

  return {
    pokemon,
    species,
    evolutionChain,
    loading,
    error,
    fetchPokemon
  };
}; 