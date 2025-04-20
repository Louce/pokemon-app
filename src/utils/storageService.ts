import Cookies, { CookieAttributes } from 'js-cookie';

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'pokemon_favorites',
  RECENTLY_VIEWED: 'pokemon_recently_viewed',
  THEME: 'pokemon_theme',
  VIEW_MODE: 'pokemon_view_mode',
  SEARCH_HISTORY: 'pokemon_search_history',
  AUTH_TOKEN: 'pokemon_auth_token',
  USER_ID: 'pokemon_user_id'
};

// Cookie options type
type CookieOptions = CookieAttributes;

/**
 * Storage service for consistent access to localStorage, sessionStorage, and cookies
 */
export const storageService = {
  // LocalStorage operations
  local: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (e) {
        console.error(`Error getting localStorage item: ${key}`, e);
        return defaultValue || null;
      }
    },
    set: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Error setting localStorage item: ${key}`, e);
      }
    },
    remove: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing localStorage item: ${key}`, e);
      }
    }
  },

  // SessionStorage operations
  session: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch (e) {
        console.error(`Error getting sessionStorage item: ${key}`, e);
        return defaultValue || null;
      }
    },
    set: <T>(key: string, value: T): void => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Error setting sessionStorage item: ${key}`, e);
      }
    },
    remove: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.error(`Error removing sessionStorage item: ${key}`, e);
      }
    }
  },

  // Cookie operations
  cookie: {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const value = Cookies.get(key);
        return value ? JSON.parse(value) : defaultValue || null;
      } catch (e) {
        console.error(`Error getting cookie: ${key}`, e);
        return defaultValue || null;
      }
    },
    set: <T>(key: string, value: T, options?: CookieOptions): void => {
      try {
        Cookies.set(key, JSON.stringify(value), options);
      } catch (e) {
        console.error(`Error setting cookie: ${key}`, e);
      }
    },
    remove: (key: string, options?: CookieOptions): void => {
      try {
        Cookies.remove(key, options);
      } catch (e) {
        console.error(`Error removing cookie: ${key}`, e);
      }
    }
  }
}; 