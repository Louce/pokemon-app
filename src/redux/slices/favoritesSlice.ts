import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PokemonDetail } from '../../services/pokemonService';

// Define the state type
interface FavoritesState {
  favoriteIds: string[];
  favoriteDetails: Record<string, PokemonDetail>;
}

// Initial state
const initialState: FavoritesState = {
  favoriteIds: [],
  favoriteDetails: {},
};

// Create slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.favoriteIds.indexOf(id);
      
      if (index === -1) {
        // Add to favorites
        state.favoriteIds.push(id);
      } else {
        // Remove from favorites
        state.favoriteIds.splice(index, 1);
        
        // Also remove from favoriteDetails to keep state clean
        if (state.favoriteDetails[id]) {
          delete state.favoriteDetails[id];
        }
      }
    },
    addFavoriteDetail: (state, action: PayloadAction<PokemonDetail>) => {
      const pokemon = action.payload;
      state.favoriteDetails[pokemon.id.toString()] = pokemon;
    },
    clearAllFavorites: (state) => {
      state.favoriteIds = [];
      state.favoriteDetails = {};
    },
  },
});

export const { toggleFavorite, addFavoriteDetail, clearAllFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 