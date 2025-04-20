import { useState, useEffect } from 'react';

import { getPokemonList, PokemonListResponse } from '../services/pokemonService';

interface UsePokemonListResult {
  pokemonList: PokemonListResponse | null;
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

const ITEMS_PER_PAGE = 20;

export const usePokemonList = (): UsePokemonListResult => {
  const [pokemonList, setPokemonList] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const data = await getPokemonList(ITEMS_PER_PAGE, offset);
        setPokemonList(data);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, [page]);

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    pokemonList,
    loading,
    error,
    page,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage
  };
}; 