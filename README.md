# Pokémon Explorer App

[![CI](https://github.com/USERNAME/pokemon-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/pokemon-explorer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)

A modern, responsive Pokémon information application built with React 19, TypeScript, and styled-components. This application provides a beautiful, interactive interface to browse, search, and filter Pokémon data from the PokéAPI.

![Pokémon Explorer Screenshot](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## ✨ Features

- **Beautiful UI**: Modern, responsive design with elegant animations
- **Comprehensive Data**: Detailed information for each Pokémon including stats, evolution chains, and abilities
- **Advanced Filtering**: Filter Pokémon by type, stats, and other attributes
- **Smart Search**: Fast, intuitive search with autocomplete and recent search history
- **Performance Optimized**: Efficient data caching and component memoization
- **Responsive Design**: Seamless experience across all device sizes
- **Theme Support**: Toggle between light and dark mode
- **Accessibility**: WCAG compliant for keyboard navigation and screen readers
- **URL Integration**: Shareable search results and filter configurations
- **Evolution Visualization**: Visual representation of Pokémon evolution chains

## 🚀 Recent Improvements

- **Performance Optimizations**: Enhanced `PokemonDetails` component with useMemo and extracted reusable components
- **Code Quality Tools**: Added ESLint, Prettier, and TypeScript strict mode
- **Comprehensive Testing**: Improved test coverage with React Testing Library
- **Error Handling**: Enhanced fallback image system for broken image links
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing and deployment
- **Documentation**: Improved code documentation and project setup instructions

## 🛠️ Technologies

- **Frontend**:
  - React 19
  - TypeScript 4.9
  - React Router 7
  - Redux Toolkit & Redux Persist
  - Styled Components 6
  - Framer Motion 12
  - Axios

- **Development & Testing**:
  - ESLint & Prettier
  - Jest & React Testing Library
  - GitHub Actions

- **Deployment**:
  - Vercel

## 🏗️ Project Structure

```
pokemon-app/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Route-level components
│   ├── redux/             # Redux store and slices
│   ├── services/          # API services
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── .env.example           # Example environment variables
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .npmrc                 # NPM configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/USERNAME/pokemon-explorer.git
   cd pokemon-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   # or with yarn
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## 🚀 Deployment

### Deploying to Vercel

#### Option 1: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   vercel
   ```

#### Option 2: Via Vercel Dashboard

1. Push your code to a GitHub repository
2. Connect your repository in the [Vercel Dashboard](https://vercel.com)
3. Configure build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

## 🤝 Contributing

Contributions are welcome! Please check out our [contribution guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [PokéAPI](https://pokeapi.co/) for the comprehensive Pokémon data
- [PokeAPI/sprites](https://github.com/PokeAPI/sprites) for the Pokémon images
- All contributors who have helped improve this project
