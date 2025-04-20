import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleFavorite, addFavoriteDetail } from '../redux/slices/favoritesSlice';
import { PokemonDetail } from '../services/pokemonService';
import { storageService, STORAGE_KEYS } from '../utils/storageService';

type FavoritesContextType = {
  favorites: string[];
  favoriteDetails: Record<string, PokemonDetail>;
  isFavorite: (id: string) => boolean;
  toggleFavoritePokemon: (id: string, pokemon?: PokemonDetail) => void;
  clearAllFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  // Fix typing for the favorites state
  const favoritesState = useSelector((state: RootState) => state.favorites);
  
  // Use useMemo to prevent unnecessary recalculations
  const favoriteIds = useMemo(() => favoritesState?.favoriteIds || [], [favoritesState?.favoriteIds]);
  const favoriteDetails = useMemo(() => favoritesState?.favoriteDetails || {}, [favoritesState?.favoriteDetails]);
  
  // Initial load from localStorage if Redux store is empty
  useEffect(() => {
    if (favoriteIds.length === 0) {
      const storedFavorites = storageService.local.get<string[]>(STORAGE_KEYS.FAVORITES, []);
      if (storedFavorites && storedFavorites.length > 0) {
        // Populate Redux store with stored favorites
        storedFavorites.forEach(id => {
          dispatch(toggleFavorite(id));
        });
      }
    }
  }, [dispatch, favoriteIds.length]);
  
  // Keep localStorage in sync with Redux store
  useEffect(() => {
    storageService.local.set(STORAGE_KEYS.FAVORITES, favoriteIds);
  }, [favoriteIds]);
  
  const isFavorite = (id: string): boolean => {
    return favoriteIds.includes(id);
  };
  
  const toggleFavoritePokemon = (id: string, pokemon?: PokemonDetail): void => {
    // Check if it's already a favorite BEFORE toggling
    const isCurrentlyFavorite = isFavorite(id);
    
    dispatch(toggleFavorite(id));
    
    // Only add details if we're adding to favorites (not already a favorite)
    if (pokemon && !isCurrentlyFavorite) {
      dispatch(addFavoriteDetail(pokemon));
    }
  };
  
  const clearAllFavorites = (): void => {
    // Clear favorites in Redux
    dispatch({ type: 'favorites/clearAllFavorites' });
    // Clear localStorage
    storageService.local.remove(STORAGE_KEYS.FAVORITES);
  };
  
  const value = {
    favorites: favoriteIds,
    favoriteDetails,
    isFavorite,
    toggleFavoritePokemon,
    clearAllFavorites,
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};