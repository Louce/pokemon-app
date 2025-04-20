import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers
import pokemonReducer from './slices/pokemonSlice';
import favoritesReducer from './slices/favoritesSlice';
import userPreferencesReducer from './slices/userPreferencesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['favorites', 'userPreferences'], // only these will be persisted
};

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  favorites: favoritesReducer,
  userPreferences: userPreferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Define types for state
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; 