# Ciné Saveurs - Project README

## Présentation Générale

**Quoi ?**
Conception et développement d'un site web de recettes de cuisine inspirées du cinéma et des séries.

**Qui ?**
Une entreprise fictive de divertissement (streaming, production cinématographique, etc.) souhaitant proposer une expérience innovante à ses utilisateurs.

**Pour qui ?**
Amateurs de cuisine et de cinéma, curieux gourmands, fans de films et de séries.

**Comment ?**
En équipe, Julie et Joseph, de développeurs full-stack. Organisation en méthode agile pour la gestion de projet.

---

## Présentation du Projet de Développement

### Besoins Fonctionnels (Minimum Viable Product - MVP)

1. **Catalogue de recettes** : Affichage des recettes, recherche par titre ou film/série associé, filtres par catégorie (entrée, plat, dessert, etc.).
2. **Page recette** : Affichage des ingrédients sous forme de texte, instructions, film/série associé, informations complémentaires (anecdotes, etc.).
3. **Système d'authentification** : Connexion, inscription, gestion de profil utilisateur.
4. **Page d’ajout d’une recette** : Accessible uniquement pour les utilisateurs connectés.
5. **Back-office (administration)** : Gestion des recettes, des catégories et des utilisateurs.

### Propositions d’évolutions possibles

1. **Fonctionnalités sociales** :
   - Commentaires avec modération dans le back-office.
   - Système de notation (étoiles, likes).
2. **Gestion des ingrédients** : Passer des ingrédients sous forme de texte à une gestion plus structurée.
3. **Filtrage par ingrédient** : Ajout d'un filtre supplémentaire dans le catalogue de recettes, permettant de chercher par ingrédient.

---

## Contraintes Techniques

### Technologies
- frontend avec React, typescript et scss.
- Backend avec Node.js et express.

### Sécurité
- Authentification sécurisée (hashage des mots de passe, session sécurisée).
- Protection contre les failles courantes (XSS, injections SQL, CSRF, etc.).

### Déploiement
- Procédure de déploiement minimale pour une application web fonctionnelle.
- Intégration continue et déploiement continu (CI/CD) en bonus.

### Responsive
- Application développée en mobile first et responsive pour une compatibilité sur tous les appareils.

### Accessibilité
- Respect des normes d'accessibilité web WCAG (Web Content Accessibility Guidelines).

### RGPD et mentions légales
- Respect du Règlement Général sur la Protection des Données (RGPD).
- Mise en place des mentions légales liées à la protection des données.

### Versionning
- Utilisation de Git pour le versionning du code source.
- Dépôt du projet sur GitHub.

### API
- Consommer au moins une API (interne ou externe).

### SEO
- Application des bonnes pratiques de référencement (SEO) pour maximiser la visibilité du site sur les moteurs de recherche.

### Tests
- Plan de tests couvrant les fonctionnalités principales du projet (tests unitaires, tests d'intégration).

### Conteneurisation (Docker)
- Utilisation de Docker pour l'environnement de développement et le déploiement du projet.

### Éco-conception
- Optimisation des images, minification des fichiers, et autres bonnes pratiques pour améliorer les performances du site.

---

## Structure du Projet

- **Frontend** : L'interface utilisateur, le design, les interactions avec l'utilisateur.
- **Backend** : Gestion des données, authentification, API et logique d’application.
- **Base de données** : Stockage des utilisateurs, recettes, commentaires, notes, etc.

---

## Installation et Déploiement

### Prérequis

1. Node.js ou un autre environnement backend (à définir).
2. Docker (pour l’environnement de développement et le déploiement).
3. Accès à GitHub pour versionner et collaborer sur le projet.

### Instructions d'Installation

1. Clonez le repository sur votre machine locale :
   ```bash
   git clone git@github.com:O-clock-Mimir/project_cinedelices_Joseph_Julie.git
   ```
2. Installez les dépendances :
   ```bash
   cd project_cinedelices_Joseph_Julie
   npm install
   ```
3. Démarrez l'application localement :
   ```bash
   npm start
   ```
---

## Contribution
Si vous souhaitez contribuer à ce projet, veuillez suivre ces étapes :

1. Forkez le repository.
2. Créez une nouvelle branche (git checkout -b feature/your-feature).
3. Faites vos modifications et committez (git commit -am 'Ajoute ma fonctionnalité').
4. Poussez sur votre branche (git push origin feature/your-feature).
5. Créez une Pull Request pour que nous puissions réviser et fusionner vos changements.

---

## Roadmap

### Sprint 0 (Conception)
- Réalisation du MCD, du MLD, et des diagrammes de cas d'utilisation, des cas d'utilisation, et des diagrammes de séquence.
- Définition des besoins fonctionnels et non fonctionnels.
- Définition des technologies et des outils à utiliser.
- Définition des contraintes techniques.
- Définition des outils de collaboration (GitHub, Trello, etc.).
- Définition des user stories et des fonctionnalités principales.
- Création du plan de projet et de la répartition des tâches.

### Sprint 1 (Développement, tests, déploiement, optimisation)
- Mise en place du backend et de la base de données.
- Création de l'interface utilisateur (UI/UX).
- Implémentation de l'authentification et de la gestion des profils.
- Finalisation des fonctionnalités MVP.
- Ajout des filtres et de la recherche dans le catalogue de recettes.
- Implémentation des tests unitaires et fonctionnels.
- Tests finaux et corrections des bugs.
- Déploiement sur un serveur de production.
- Optimisation des performances (images, code, SEO, etc.).

## Licence


Ce fichier **README.md** contient toutes les informations clés concernant le projet, notamment la présentation, les fonctionnalités principales, les contraintes techniques, ainsi que des détails pratiques pour l'installation, la contribution et l'évolution du projet.

N'oubliez pas de l'ajuster et de l'enrichir au fur et à mesure de l'avancement du projet.
