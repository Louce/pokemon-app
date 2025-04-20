import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Color Variables */
    --primary-color: #4fc1a6;
    --primary-color-rgb: 79, 193, 166;
    --secondary-color: #7176e1;
    --secondary-color-rgb: 113, 118, 225;
    --accent-color: #ffcb05;
    --accent-color-rgb: 255, 203, 5;
    --danger-color: #ef4444;
    
    /* Text Colors */
    --text-light: #2e3440;
    --text-light-secondary: #4c566a;
    --text-dark: #eceff4;
    --text-dark-secondary: #d8dee9;
    
    /* Background Colors */
    --bg-light: #f8f9fa;
    --bg-dark: #1f2128;
    
    /* Card Colors */
    --card-bg-light: #ffffff;
    --card-bg-dark: #282c34;
    
    /* Shadows */
    --card-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    --dropdown-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    
    /* Border Radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --border-radius-xl: 24px;
    
    /* Spacings - 8px Grid System */
    --spacing-1: 4px;
    --spacing-2: 8px;
    --spacing-3: 12px;
    --spacing-4: 16px;
    --spacing-5: 20px;
    --spacing-6: 24px;
    --spacing-8: 32px;
    --spacing-10: 40px;
    --spacing-12: 48px;
    --spacing-16: 64px;
    
    /* Other */
    --container-max-width: 1280px;
    --transition-speed: 0.3s;
    --header-height: 72px;
    
    /* Animation */
    --animation-duration: 0.5s;
    --animation-timing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    height: 100%;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--bg-light);
    color: var(--text-light);
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }
  
  body.dark-mode {
    background-color: var(--bg-dark);
    color: var(--text-dark);
  }
  
  /* Grid System - Using 8px increments */
  .p-1 { padding: var(--spacing-1); }
  .p-2 { padding: var(--spacing-2); }
  .p-3 { padding: var(--spacing-3); }
  .p-4 { padding: var(--spacing-4); }
  .p-5 { padding: var(--spacing-5); }
  .p-6 { padding: var(--spacing-6); }
  
  .m-1 { margin: var(--spacing-1); }
  .m-2 { margin: var(--spacing-2); }
  .m-3 { margin: var(--spacing-3); }
  .m-4 { margin: var(--spacing-4); }
  .m-5 { margin: var(--spacing-5); }
  .m-6 { margin: var(--spacing-6); }
  
  /* Improved Touch Targets */
  @media (max-width: 768px) {
    button, 
    [role="button"],
    .clickable,
    a,
    input[type="button"],
    input[type="submit"],
    input[type="reset"] {
      min-height: 44px;
      min-width: 44px;
      padding: var(--spacing-3);
      touch-action: manipulation;
    }
    
    /* Increase spacing between clickable elements */
    ul li,
    nav a,
    .clickable-container > * {
      margin-bottom: var(--spacing-2);
    }
  }
  
  /* Animations */
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  /* Improve touch scrolling */
  * {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Remove blue highlight on mobile taps */
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;

export default GlobalStyles; 