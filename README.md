# Pokémon Explorer App

A visually stunning web application built with React and TypeScript that allows users to browse and search for Pokémon data. This project utilizes React Hooks for state management, Framer Motion for animations, and incorporates modern UI/UX practices with dynamic theming based on Pokémon types.

![Pokémon Explorer App Screenshot](https://raw.githubusercontent.com/Louce/pokemon-app/master/public/screenshot.png)

## Features

- Browse Pokémon with smooth pagination 
- Search for specific Pokémon by name or ID
- View detailed information for each Pokémon with type-themed cards
- Responsive design for mobile and desktop
- Nature-inspired themes: Sunny Forest (Light) and Nocturnal Forest (Dark)
- Beautiful transitions and animations
- Dynamic card backgrounds that match Pokémon types
- Detailed evolution chains with visual representations
- Comprehensive stats with animated visualization

## Technologies Used

- React 19
- TypeScript 4
- React Router v7 for navigation
- Styled Components for styling
- Framer Motion for animations
- PokeAPI for data

## Theme Details

### Light Mode: Sunny Forest
- Fresh, vibrant color scheme inspired by sunny forest clearings
- Accent color: Pokéball red for better thematic coherence
- Subtle natural textures and playful animations

### Dark Mode: Nocturnal Forest
- Rich, deep color scheme inspired by forests at night
- Softer contrast for comfortable nighttime viewing
- Elegant animations and transitions

## Project Structure

```
pokemon-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Context providers (including ThemeContext)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
└── public/
    └── images/           # Static image assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/Louce/pokemon-app.git
cd pokemon-app
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## UI/UX Features

- **Type-Themed Cards**: Each Pokémon's detail page background adapts to its primary type color
- **Animated Transitions**: Smooth page transitions and element animations using Framer Motion
- **Hover Effects**: Interactive elements respond to user interaction with subtle animations
- **Responsive Design**: Fully optimized for all screen sizes from mobile to desktop
- **Accessible Design**: High contrast text and elements for better readability
- **3D Effects**: Subtle depth effects for cards and important UI elements

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## License

This project is open source and available under the [MIT License](https://github.com/Louce/pokemon-app/blob/master/LICENSE).

## Repository

View this project on GitHub: [https://github.com/Louce/pokemon-app](https://github.com/Louce/pokemon-app)
