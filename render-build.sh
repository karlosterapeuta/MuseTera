#!/usr/bin/env bash
# exit on error
set -o errexit

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

# Build da aplicação
echo "Construindo a aplicação..."
npm run build

echo "Build completo!"
