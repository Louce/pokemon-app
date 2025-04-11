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

  useEffect(() => {
    // Only execute search if query length is at least 2 characters
    if (searchQuery.trim().length >= 2) {
      const debounceTimer = setTimeout(() => {
        executeSearch();
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else if (searchQuery === '') {
      setSearchResults([]);
    }
  }, [searchQuery, executeSearch]);

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
    clearSearch
  };
}; 