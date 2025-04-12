# Pokémon Explorer App

A modern Pokémon information app built with React, TypeScript, and PokéAPI.

![Pokémon Explorer Screenshot](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png)

## Features

- Browse the Pokémon catalog with beautiful UI
- View detailed information about each Pokémon
- Filter Pokémon by type
- Search for Pokémon by name or ID
- Responsive design for all device sizes
- Light and dark mode theme
- Smooth animations and transitions

## Technologies Used

- React 19
- TypeScript
- React Router 7
- Styled-Components
- Framer Motion
- PokéAPI
- Axios

## Local Development

Clone the repository and run:

```bash
npm install
npm start
```

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Run the deployment command from your project directory:
```bash
vercel
```

3. Follow the prompts to complete the deployment.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a GitHub repository.

2. Go to [vercel.com](https://vercel.com) and sign up or log in.

3. Click "New Project" and import your GitHub repository.

4. Configure the project:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Development Command: `npm start`

5. Click "Deploy" and wait for the deployment to complete.

## Project Structure

- `/src/components` - UI components
- `/src/pages` - Page components
- `/src/hooks` - Custom React hooks
- `/src/services` - API service functions
- `/src/utils` - Utility functions
- `/src/contexts` - React context providers

## License

MIT
