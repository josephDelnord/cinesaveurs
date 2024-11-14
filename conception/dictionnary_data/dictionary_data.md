# Dictionnaire des Données

## 1. USER (Utilisateur)
**Description** : Représente un utilisateur inscrit sur la plateforme.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_user`       | INT       | Identifiant unique de l'utilisateur (clé primaire). |
| `name`          | TEXT      | Nom de l'utilisateur.                        |
| `email`         | TEXT      | Adresse e-mail de l'utilisateur (doit être unique). |
| `password`      | TEXT      | Mot de passe de l'utilisateur.               |
| `date_created`  | DATE      | Date de création du compte utilisateur.      |
| `status`        | TEXT      | Statut de l'utilisateur (actif, inactif, etc.). |
| `id_role`       | INT       | Identifiant du rôle de l'utilisateur (clé étrangère vers **ROLE**). |

---

## 2. RECIPE (Recette)
**Description** : Représente une recette ajoutée par un utilisateur.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_recipe`     | INT       | Identifiant unique de la recette (clé primaire). |
| `title`         | TEXT      | Titre de la recette.                         |
| `description`   | TEXT      | Description détaillée de la recette.         |
| `anecdote`      | TEXT      | Anecdote liée à la recette, si disponible.    |
| `ingredients`   | TEXT      | Liste des ingrédients nécessaires pour la recette. |
| `instructions`  | TEXT      | Étapes à suivre pour réaliser la recette.    |
| `source`        | TEXT      | Source de la recette (par exemple, livre, site web). |
| `date_added`    | DATE      | Date d'ajout de la recette à la base de données. |

---

## 3. CATEGORY (Catégorie)
**Description** : Représente une catégorie dans laquelle les recettes peuvent être classées.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_category`   | INT       | Identifiant unique de la catégorie (clé primaire). |
| `name`          | TEXT      | Nom de la catégorie (ex : entrée, plat, dessert). |

---

## 4. COMMENT (Commentaire)
**Description** : Représente un commentaire laissé par un utilisateur sur une recette.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_comment`    | INT       | Identifiant unique du commentaire (clé primaire). |
| `content`       | TEXT      | Contenu du commentaire laissé par l'utilisateur. |
| `date_comment`  | DATE      | Date et heure du commentaire.                 |
| `id_user`       | INT       | Identifiant de l'utilisateur ayant posté le commentaire (clé étrangère vers **USER**). |
| `id_recipe`     | INT       | Identifiant de la recette sur laquelle le commentaire a été posté (clé étrangère vers **RECIPE**). |

---

## 5. SCORE (Note)
**Description** : Représente la note donnée par un utilisateur à une recette.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `score`         | INT       | Valeur de la note (de 1 à 5).                 |
| `id_user`       | INT       | Identifiant de l'utilisateur ayant donné la note (clé étrangère vers **USER**). |
| `id_recipe`     | INT       | Identifiant de la recette notée (clé étrangère vers **RECIPE**). |

---

## 6. ROLE (Rôle)
**Description** : Représente les rôles d'un utilisateur (ex : administrateur, utilisateur classique).

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_role`       | INT       | Identifiant unique du rôle (clé primaire).    |
| `role`          | TEXT      | Nom du rôle (ex : "Admin", "User").           |
