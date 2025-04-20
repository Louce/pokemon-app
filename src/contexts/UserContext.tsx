import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { login, logout, addSearchQuery, ViewMode, setViewMode } from '../redux/slices/userPreferencesSlice';
import { storageService, STORAGE_KEYS } from '../utils/storageService';

// Define types
interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface UserContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  loginUser: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  registerUser: (username: string, email: string, password: string) => Promise<boolean>;
  viewMode: ViewMode;
  setUserViewMode: (mode: ViewMode) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearUserSearchHistory: () => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  // Fix typing for userPreferences
  const userPrefsState = useSelector((state: RootState) => state.userPreferences);
  const viewMode = (userPrefsState?.viewMode as ViewMode) || 'grid';
  const searchHistory = userPrefsState?.searchHistory || [];
  const isLoggedIn = userPrefsState?.isLoggedIn || false;
  const username = userPrefsState?.username || null;
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Load auth token from cookies on mount
  useEffect(() => {
    const authToken = storageService.cookie.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    const userId = storageService.cookie.get<string>(STORAGE_KEYS.USER_ID);
    
    if (authToken && userId && username) {
      // In a real app, you'd validate the token with your backend
      // For now, we'll simulate a logged in user if we have these values
      setCurrentUser({
        id: userId,
        username: username
      });
    }
  }, [username]);
  
  // Mock login function - in a real app, this would call your API
  const loginUser = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful login
      const mockUser = {
        id: '123',
        username,
        email: `${username}@example.com`
      };
      
      // Store user in Redux
      dispatch(login(username));
      
      // Store user in context
      setCurrentUser(mockUser);
      
      // Store auth info in cookies (would be JWT in real app)
      storageService.cookie.set(STORAGE_KEYS.AUTH_TOKEN, 'mock-jwt-token', { 
        expires: 7, // 7 days
        secure: true
      });
      storageService.cookie.set(STORAGE_KEYS.USER_ID, mockUser.id);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Logout function
  const logoutUser = (): void => {
    // Clear user from Redux
    dispatch(logout());
    
    // Clear user from context
    setCurrentUser(null);
    
    // Remove auth data from cookies
    storageService.cookie.remove(STORAGE_KEYS.AUTH_TOKEN);
    storageService.cookie.remove(STORAGE_KEYS.USER_ID);
  };
  
  // Mock register function
  const registerUser = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Automatically log in after successful registration
      return await loginUser(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };
  
  // View mode functions
  const setUserViewMode = (mode: ViewMode): void => {
    dispatch(setViewMode(mode));
    storageService.local.set(STORAGE_KEYS.VIEW_MODE, mode);
  };
  
  // Search history functions
  const addToSearchHistory = (query: string): void => {
    dispatch(addSearchQuery(query));
    
    // We'll also store this in sessionStorage for the current session
    const sessionSearchHistory = 
      storageService.session.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []) || [];
    
    // Add to session search history
    const updatedHistory = [query, ...sessionSearchHistory.filter(q => q !== query)]
      .slice(0, 10);
    
    storageService.session.set(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
  };
  
  const clearUserSearchHistory = (): void => {
    dispatch({ type: 'userPreferences/clearSearchHistory' });
    storageService.session.remove(STORAGE_KEYS.SEARCH_HISTORY);
  };
  
  // Context value
  const value: UserContextType = {
    currentUser,
    isLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    viewMode,
    setUserViewMode,
    searchHistory,
    addToSearchHistory,
    clearUserSearchHistory
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Hook for using the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 