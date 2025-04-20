import { FilterOptions } from '../contexts/FilterContext';
import { PokemonDetail } from '../services/pokemonService';

/**
 * Applies filters to an array of Pokemon
 * @param pokemon - Array of Pokemon details to filter
 * @param filters - Filter options to apply
 * @returns Filtered array of Pokemon
 */
export const applyFilters = (pokemon: PokemonDetail[], filters: FilterOptions): PokemonDetail[] => {
  let filteredPokemon = [...pokemon];
  
  // Apply ability filter
  if (filters.ability) {
    filteredPokemon = filteredPokemon.filter(pokemon => 
      pokemon.abilities.some(a => a.ability.name === filters.ability)
    );
  }
  
  // Apply weight filters (API returns weight in hectograms, convert to kg)
  if (filters.minWeight !== null && filters.minWeight !== undefined) {
    const minWeight = filters.minWeight;
    filteredPokemon = filteredPokemon.filter(pokemon => 
      pokemon.weight >= minWeight * 10
    );
  }
  if (filters.maxWeight !== null && filters.maxWeight !== undefined) {
    const maxWeight = filters.maxWeight;
    filteredPokemon = filteredPokemon.filter(pokemon => 
      pokemon.weight <= maxWeight * 10
    );
  }
  
  // Apply height filters (API returns height in decimetres, convert to m)
  if (filters.minHeight !== null && filters.minHeight !== undefined) {
    const minHeight = filters.minHeight;
    filteredPokemon = filteredPokemon.filter(pokemon => 
      pokemon.height >= minHeight * 10
    );
  }
  if (filters.maxHeight !== null && filters.maxHeight !== undefined) {
    const maxHeight = filters.maxHeight;
    filteredPokemon = filteredPokemon.filter(pokemon => 
      pokemon.height <= maxHeight * 10
    );
  }
  
  // Apply minimum base stats filter
  if (filters.minBaseStats !== null && filters.minBaseStats !== undefined) {
    const minBaseStats = filters.minBaseStats;
    filteredPokemon = filteredPokemon.filter(pokemon => {
      const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
      return totalStats >= minBaseStats;
    });
  }
  
  // Apply generation filter
  if (filters.generation !== null) {
    // Map generations to ID ranges
    const genRanges: Record<number, [number, number]> = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 898]
    };
    
    const range = genRanges[filters.generation as number];
    if (range) {
      filteredPokemon = filteredPokemon.filter(
        pokemon => pokemon.id >= range[0] && pokemon.id <= range[1]
      );
    }
  }
  
  return filteredPokemon;
};

// Simple cache for Pokemon data to avoid redundant API calls
export class PokemonCache {
  private typeCache: Map<string, PokemonDetail[]> = new Map();
  private detailsCache: Map<string, PokemonDetail> = new Map();
  
  // Store Pokemon by type
  setTypeResults(type: string, pokemon: PokemonDetail[]): void {
    this.typeCache.set(type, pokemon);
  }
  
  // Get Pokemon by type from cache
  getTypeResults(type: string): PokemonDetail[] | undefined {
    return this.typeCache.get(type);
  }
  
  // Check if we have cached results for this type
  hasTypeResults(type: string): boolean {
    return this.typeCache.has(type);
  }
  
  // Store an individual Pokemon
  setPokemonDetail(id: string, pokemon: PokemonDetail): void {
    this.detailsCache.set(id, pokemon);
  }
  
  // Get an individual Pokemon
  getPokemonDetail(id: string): PokemonDetail | undefined {
    return this.detailsCache.get(id);
  }
  
  // Check if we have this Pokemon cached
  hasPokemonDetail(id: string): boolean {
    return this.detailsCache.has(id);
  }
  
  // Clear all caches
  clear(): void {
    this.typeCache.clear();
    this.detailsCache.clear();
  }
} 