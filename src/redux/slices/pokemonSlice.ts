import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PokemonDetail } from '../../services/pokemonService';

interface PokemonState {
  pokemonDetails: Record<string, PokemonDetail>;
  recentlyViewed: string[];
}

const initialState: PokemonState = {
  pokemonDetails: {},
  recentlyViewed: []
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    addPokemonDetail: (state, action: PayloadAction<PokemonDetail>) => {
      const pokemon = action.payload;
      state.pokemonDetails[pokemon.id.toString()] = pokemon;
    },
    addToRecentlyViewed: (state, action: PayloadAction<string>) => {
      const pokemonId = action.payload;
      
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== pokemonId);
      
      // Add to front
      state.recentlyViewed.unshift(pokemonId);
      
      // Limit to 10 items
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    }
  }
});

export const { 
  addPokemonDetail, 
  addToRecentlyViewed, 
  clearRecentlyViewed 
} = pokemonSlice.actions;

export default pokemonSlice.reducer; 