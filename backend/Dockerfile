# Étape 1 : Utiliser l'image de base Node.js
FROM node:14

# Étape 2 : Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de configuration pour installer les dépendances
COPY backend/package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le code source dans le conteneur
COPY backend/ ./

# Étape 6 : Exposer le port que l'application utilise (par exemple, 3000)
EXPOSE 5000

# Étape 7 : Lancer l'application Node.js
CMD ["npm", "start"]
