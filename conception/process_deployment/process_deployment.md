# Documentation du Processus de Déploiement CI/CD

Ce document décrit le processus de déploiement de l'application à travers une pipeline CI/CD utilisant GitHub Actions.

## 1. Vue d'ensemble du processus

Le processus de déploiement CI/CD est automatisé à l'aide de GitHub Actions et s'exécute sur chaque modification poussée vers la branche `master` ou lors de l'ouverture d'une Pull Request (PR) vers cette branche. Cette pipeline est conçue pour :

- Construire le projet (backend et frontend).
- Exécuter des tests pour s'assurer de la stabilité de l'application.
- Déployer l'application sur un serveur distant via SSH.

## 2. Déclenchement de la pipeline

La pipeline est configurée pour se déclencher automatiquement dans les conditions suivantes :

- **Lors d'un push vers la branche `master`**.
- **Lors de la création d'une Pull Request vers la branche `master`**.

Cela garantit que seules les modifications validées par les tests sont déployées en production.

### Exemple de configuration :

```yaml
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
```

## 3. Permissions nécessaires

Pour garantir le bon fonctionnement de la pipeline, certaines permissions sont requises :

### Exemple de configuration :

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## 4. Étapes du Job de Build

Le job `build` est responsable de la préparation de l'application, de l'installation des dépendances et de l'exécution des tests.

### Étapes :

#### 1. Checkout du code source : Récupère le dernier code source du dépôt.

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

#### 2. Configuration de Node.js pour le backend : Installe et configure Node.js avec la version `20.x`.

```yaml
- name: Set up Node.js for backend
  uses: actions/setup-node@v4
  with:
    node-version: '20.x'
```

#### 3. Installation des dépendances :

- Backend : `npm install` dans le répertoire `backend`.
- Frontend : `npm install` dans le répertoire `frontend`.

```yaml
- name: Install backend dependencies
  run: |
    cd backend
    npm install
```

#### 4. Exécution des tests :

- Backend : `npm test` dans le répertoire `backend`.
- Frontend : `npm test` dans le répertoire `frontend`.

```yaml
- name: Run backend tests
  run: |
    cd backend
    npm test
```

#### 5. Build du frontend : Génère le frontend optimisé pour la production.

```yaml
- name: Build frontend
  run: |
    cd frontend
    npm run build
```

#### 6. Génération des artefacts de GitHub Pages : Crée un artefact avec les fichiers du frontend générés pour un usage ultérieur dans le déploiement.

```yaml
- name: generate GitHub Pages Artifact
  uses: actions/upload-pages-artifact@v3
  with:
    name: build
    path: ./frontend/dist
```

## 5. Étapes du Job de Déploiement

Le job deploy déploie l'application sur un serveur distant en utilisant SSH. Ce job ne s'exécute que si le job build a réussi.

### Étapes :

### 1. Checkout du code source : Télécharge à nouveau le code source pour s'assurer qu'il est à jour avant le déploiement.

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

### 2. Connexion SSH et déploiement :

- Utilise les clés SSH stockées dans les secrets GitHub pour se connecter au serveur.
- Récupère les dernières modifications via `git pull`.
- Installe les dépendances et relance le backend et le frontend avec PM2.

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v0.1.5
  with:
    host: ${{ secrets.HOST }}
    username: ${{ secrets.SSH_USERNAME }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd .
      git pull origin master
      cd backend
      npm install
      pm2 restart backend
      cd ../frontend
      npm install
      npm run build
      pm2 restart frontend
```

## 6. Prérequis et Configuration

### Clés SSH et Secrets

Assurez-vous que les informations suivantes sont stockées dans les secrets GitHub pour la sécurité de la connexion SSH et du déploiement :

- HOST : L'adresse IP ou le nom de domaine de votre serveur de production.
- SSH_USERNAME : Le nom d'utilisateur pour l'accès SSH.
- SSH_PRIVATE_KEY : La clé privée SSH pour la connexion sécurisée.

### Environnement Serveur

Sur le serveur de production, assurez-vous que les éléments suivants sont installés :

- Node.js : La version correspondant à celle spécifiée dans la configuration (ici `20.x`).
- PM2 : Pour gérer et redémarrer les processus backend et frontend.

## 7. Résumé du Workflow

1. Trigger : La pipeline est déclenchée sur un `push` ou une `pull request` vers la branche `master`.
2. Job `build` : Installe les dépendances, exécute les tests, génère les fichiers de production du frontend et crée des artefacts.
3. Job `deploy` : Déploie l'application sur le serveur distant en utilisant SSH et redémarre les services via PM2.
