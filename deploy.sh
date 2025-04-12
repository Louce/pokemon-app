#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparing to deploy Pokémon Explorer to Vercel...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

echo -e "${GREEN}Deployment complete! Your Pokémon Explorer app is now live.${NC}"
echo -e "${YELLOW}You can view your deployments at: https://vercel.com/dashboard${NC}" 