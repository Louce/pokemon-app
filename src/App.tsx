import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import './App.css';
import Home from './pages/Home';
import PokemonDetails from './pages/PokemonDetails';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { UserProvider } from './contexts/UserContext';
import { FilterProvider } from './contexts/FilterContext';
import Loading from './components/Loading';

/**
 * AnimatedRoutes component handles page transitions using Framer Motion
 * This component wraps all routes with animation capabilities
 */
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Page transition animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    }
  };
  
  // Transition timing settings with cubic-bezier easing
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };
  
  return (
    // AnimatePresence detects when components enter/exit the DOM
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page-wrapper"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Main App component that sets up routing and theme context
 * Routes are wrapped in AnimatedRoutes for smooth page transitions
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeProvider>
          <UserProvider>
            <FavoritesProvider>
              <Router>
                <FilterProvider>
                  <div className="App">
                    <Navbar />
                    <main className="app-main">
                      <AnimatedRoutes />
                    </main>
                    <Footer />
                  </div>
                </FilterProvider>
              </Router>
            </FavoritesProvider>
          </UserProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
