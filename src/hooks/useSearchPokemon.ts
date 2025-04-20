import { useState, useEffect, useCallback } from 'react';
import { searchPokemon, PokemonDetail } from '../services/pokemonService';

interface UseSearchPokemonResult {
  searchResults: PokemonDetail[];
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  executeSearch: () => Promise<void>;
  clearSearch: () => void;
  getSuggestions: (query: string) => Promise<void>;
}

export const useSearchPokemon = (): UseSearchPokemonResult => {
  const [searchResults, setSearchResults] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const executeSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await searchPokemon(searchQuery);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);
  
  // New function for getting suggestions without the loading state
  const getSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      return;
    }
    
    try {
      const results = await searchPokemon(query, true); // true flag for suggestions mode
      setSearchResults(results);
      setError(null);
    } catch (err) {
      // Silently handle errors for suggestions
      console.error('Error getting suggestions:', err);
    }
  }, []);

  useEffect(() => {
    // Only execute search if query length is at least 2 characters
    if (searchQuery.trim().length >= 2) {
      const debounceTimer = setTimeout(() => {
        // Use getSuggestions instead of the full search for faster feedback
        getSuggestions(searchQuery);
      }, 300); // Reduced from 500ms to 300ms for faster suggestions

      return () => clearTimeout(debounceTimer);
    } else if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery, getSuggestions]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    searchResults,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    executeSearch,
    clearSearch,
    getSuggestions
  };
}; 