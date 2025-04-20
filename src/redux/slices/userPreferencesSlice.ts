import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export type ViewMode = 'grid' | 'list';

interface UserPreferencesState {
  isLoggedIn: boolean;
  username: string | null;
  viewMode: ViewMode;
  searchHistory: string[];
  selectedTypes: string[];
  perPage: number;
}

// Initial state
const initialState: UserPreferencesState = {
  isLoggedIn: false,
  username: null,
  viewMode: 'grid',
  searchHistory: [],
  selectedTypes: [],
  perPage: 20,
};

// Create slice
const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.username = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = null;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    addSearchQuery: (state, action: PayloadAction<string>) => {
      // Add to the beginning and remove duplicates
      state.searchHistory = [
        action.payload,
        ...state.searchHistory.filter(query => query !== action.payload)
      ].slice(0, 10); // Limit to 10 items
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    toggleTypeFilter: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      const index = state.selectedTypes.indexOf(type);
      
      if (index === -1) {
        // Add type
        state.selectedTypes.push(type);
      } else {
        // Remove type
        state.selectedTypes.splice(index, 1);
      }
    },
    clearTypeFilters: (state) => {
      state.selectedTypes = [];
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    }
  },
});

export const {
  login,
  logout,
  setViewMode,
  addSearchQuery,
  clearSearchHistory,
  toggleTypeFilter,
  clearTypeFilters,
  setPerPage,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer; 