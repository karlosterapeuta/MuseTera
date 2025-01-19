#!/usr/bin/env bash
# exit on error
set -e

# Exibir versões
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Limpar cache e instalações anteriores
echo "Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependências
echo "Instalando dependências..."
npm install

# Generate Prisma client
npx prisma generate

# Build da aplicação
echo "Construindo a aplicação..."
npm run build

# Create the standalone directory if it doesn't exist
mkdir -p .next/standalone

# Copy necessary files to the standalone directory
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
cp .env .next/standalone/

# Make the server.js executable
chmod +x .next/standalone/server.js

echo "Build completo!"
