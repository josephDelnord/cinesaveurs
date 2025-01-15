
## Liste des Endpoints API (Noms de Routes en Anglais)

| **Catégorie**         | **Méthode**    | **Route**                                    | **Description**                                                       |
|-----------------------|----------------|----------------------------------------------|-----------------------------------------------------------------------|
| **Authentification**   | **POST**       | /api/auth/register                           | Créer un nouveau compte utilisateur.                                   |
|                       | **POST**       | /api/auth/login                              | Connexion d'un utilisateur avec email et mot de passe.                |
| **Utilisateurs**       | **GET**        | /api/users/:id                            | Récupérer les informations du profil de l'utilisateur  connecté (admin ou utilisateur lui-même).      |
|                       | **PUT**        | /api/users/:id                            | Mettre à jour les informations d'un utilisateur (admin ou utilisateur lui-même). |
|                       | **DELETE**     | /api/users/:id                            | Supprimer un utilisateur (admin seulement).                           |
|                       | **GET**        | /api/users                                    | Récupérer la liste de tous les utilisateurs (admin seulement).                          |
|                       | **GET**        | /api/users/:id/status                    | Récupérer le statut d'un utilisateur (admin seulement).                                 |
|                       | **PUT**        | /api/users/:id/status                    | Suspension ou désactivation d'un utilisateur (admin seulement).       |
|                       | **PUT**        | /api/users/:id/status                    | Activer un utilisateur (admin seulement).                             |
|                       | **PUT**        | /api/users/:id/status                    | Bannir un utilisateur (admin seulement).                              |
| **Rôles**              | **POST**       | /api/roles/                                  | Récupérer tous les rôles (admin seulement).             |
|                       | **GET**        | /api/roles/:id                               | Récupérer un rôle par ID (admin seulement).                           |
|                       | **GET**        | /api/roles/                                  | Créer un nouveau rôle (admin seulement).                              |
|                       | **GET**        | /api/roles/:id                                 | Supprimer un rôle (admin seulement).                                  |
| **Recettes**           | **GET**        | /api/recipes                                 | Récupérer toutes les recettes, avec options de filtrage par catégorie, popularité, etc. |
|                       | **GET**        | /api/recipes/:id                             | Récupérer les détails d'une recette spécifique.                       |
|                       | **POST**       | /api/recipes                                 | Ajouter une nouvelle recette  |
|                       | **PUT**        | /api/recipes/:id                             | Mettre à jour une recette existante (réservée aux utilisateurs ayant créé la recette ou aux administrateurs). |
|                       | **DELETE**     | /api/recipes/:id                             | Supprimer une recette (admin seulement). |
|                       | **GET**        | /api/recipes/research                        | Rechercher des recettes par titre ou source.               |
|                      | **POST**       | /api/recipes/:id/comments                      | Ajouter un commentaire à une recette.                                 |
|                       | **GET**        | /api/recipes/:id/comments                      | Récupérer les commentaires d'une recette spécifique.                  |
|                       | **PUT**        | /api/recipes/:id/comments/id                     | Mettre à jour un commentaire (admin seulement). |
|                       | **DELETE**     | /api/recipes/:id/comments/id                    | Supprimer un commentaire (admin seulement). |
|                       | **POST**       | /api/recipes/:id/scores                        | Ajouter ou mettre à jour une note à une recette (1 à 5 étoiles).      |
|                       | **GET**        | /api/recipes/:id/scores                       | Récupérer la note moyenne d'une recette.                              |
|                       | **GET**        | /api/recipes/:id/scores                       | Récupérer le score d'un utilisateur pour une recette spécifique.     |
|                       | **DELETE**     | /api/recipes/:id/scores/:id                        | Supprimer un score (admin seulement).                                 |
| **Catégories**         | **GET**        | /api/categories                              | Récupérer toutes les catégories de recettes disponibles.              |
|                       | **POST**       | /api/categories                             | Ajouter une nouvelle catégorie (admin seulement).       |
|                       | **PUT**        | /api/categories/:id                          | Mettre à jour une catégorie existante (admin seulement). |
|                       | **DELETE**     | /api/categories/:id                          | Supprimer une catégorie (admin seulement).               |
| **Commentaires**     | **GET**        | /api/comments                                | Récupérer tous les commentaires des recettes spécifique.                  |
| **Notes**             | **GET**        | /api/scores                                 | Récupérer tous les scores des recettes                              |
| **Status**             | **POST**       | /api/status                                  | Récupérer les statuts des utilisateurs (admin seulement).            |
|                       | **POST**       | /api/status/                                  | Créer un statut (admin seulement).                                    |
