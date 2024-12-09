# Étape 1 : Utiliser une image de base Node.js pour construire l'application
FROM node:14 AS build

# Étape 2 : Créer et définir le répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copier les fichiers de configuration pour installer les dépendances
COPY frontend/package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le code source et construire l'application
COPY frontend/ ./
RUN npm run build

# Étape 6 : Utiliser Nginx pour servir l'application construite
FROM nginx:alpine

# Étape 7 : Copier le build de React dans le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Étape 8 : Exposer le port 80
EXPOSE 80

# Étape 9 : Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
