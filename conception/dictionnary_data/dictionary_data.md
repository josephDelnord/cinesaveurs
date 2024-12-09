# Dictionnaire des Données

## 1. USER (Utilisateur)
**Description** : Représente un utilisateur inscrit sur la plateforme.

| **Attribut**      | **Type**  | **Description**                               |
|-------------------|-----------|-----------------------------------------------|
| `id_user`         | INT       | Identifiant unique de l'utilisateur (clé primaire). |
| `name`            | TEXT      | Nom de l'utilisateur.                        |
| `email`           | TEXT      | Adresse e-mail de l'utilisateur (doit être unique). |
| `password`        | TEXT      | Mot de passe de l'utilisateur.               |
| `confirmPassword` | TEXT      | Confirmation du mot de passe de l'utilisateur. |
| `id_status`       | INT       | Identifiant du statut de l'utilisateur (clé étrangère vers **STATUS**). |
| `id_role`         | INT       | Identifiant du rôle de l'utilisateur (clé étrangère vers **ROLE**). |

---

## 2. ROLE (Rôle)
**Description** : Représente les rôles d'un utilisateur (ex : administrateur, utilisateur classique).

| **Attribut**         | **Type**  | **Description**                               |
|----------------------|-----------|-----------------------------------------------|
| `id_role`            | INT       | Identifiant unique du rôle (clé primaire).    |
| `role_name`          | TEXT      | Nom du rôle (ex : "Admin", "User").           |

---

## 3. STATUS (Statut)
**Description** : Représente le statut d'un utilisateur (ex : actif, inactif).

| **Attribut**         | **Type**  | **Description**                               |
|----------------------|-----------|-----------------------------------------------|
| `id_status`          | INT       | Identifiant unique du statut (clé primaire). |
| `status_name`        | TEXT      | Nom du statut (ex : "Actif", "Inactif").     |

---

## 4. CATEGORY (Catégorie)
**Description** : Représente une catégorie dans laquelle les recettes peuvent être classées.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_category`   | INT       | Identifiant unique de la catégorie (clé primaire). |
| `name`          | TEXT      | Nom de la catégorie (ex : entrée, plat, dessert). |

---

## 5. RECIPE (Recette)
**Description** : Représente une recette ajoutée par un utilisateur.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_recipe`     | INT       | Identifiant unique de la recette (clé primaire). |
| `title`         | TEXT      | Titre de la recette.                         |
| `description`   | TEXT      | Description détaillée de la recette.         |
| `anecdote`      | TEXT      | Anecdote liée à la recette, si disponible.    |
| `source`        | TEXT      | Source de la recette (par exemple, livre, site web). |
| `image`         | TEXT      | URL de l'image associée à la recette.       |
| `id_category`   | INT       | Identifiant de la catégorie de la recette (clé étrangère vers **CATEGORY**). |
| `id_ingredient` | INT       | Identifiant de l'ingrédient principal de la recette (clé étrangère vers **INGREDIENT**). |
| `id_instruction`| INT       | Identifiant de l'instruction de la recette (clé étrangère vers **INSTRUCTION**). |

---

## 6. INGREDIENT (Ingrédient)
**Description** : Représente un ingrédient utilisé dans une recette.

| **Attribut**           | **Type**  | **Description**                               |
|------------------------|-----------|-----------------------------------------------|
| `id_ingredient`        | INT       | Identifiant unique de l'ingrédient (clé primaire). |
| `name`                 | TEXT      | Nom de l'ingrédient.                         |
| `quantity`             | TEXT      | Quantité de l'ingrédient. |
| `quantity_description` | TEXT      | Description de la quantité de l'ingrédient. |
| `unit`                 | TEXT      | Unité de mesure de l'ingrédient. |

---

## 7. INSTRUCTION (Instruction)
**Description** : Représente une étape de la préparation d'une recette.

| **Attribut**         | **Type**  | **Description**                               |
|------------------------|-----------|-----------------------------------------------|
| `id_instruction`       | INT       | Identifiant unique de l'instruction (clé primaire). |
| `step_number`          | INT       | Numéro de l'étape dans la préparation.       |
| `instruction`          | TEXT      | Description de l'étape de la préparation.    |

---

## 8. COMMENT (Commentaire)
**Description** : Représente un commentaire laissé par un utilisateur sur une recette.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_comment`    | INT       | Identifiant unique du commentaire (clé primaire). |
| `content`       | TEXT      | Contenu du commentaire laissé par l'utilisateur. |
| `id_user`       | INT       | Identifiant de l'utilisateur ayant posté le commentaire (clé étrangère vers **USER**). |
| `id_recipe`     | INT       | Identifiant de la recette sur laquelle le commentaire a été posté (clé étrangère vers **RECIPE**). |

---

## 9. SCORE (Note)
**Description** : Représente la note donnée par un utilisateur à une recette.

| **Attribut**    | **Type**  | **Description**                               |
|-----------------|-----------|-----------------------------------------------|
| `id_score`     | INT       | Identifiant unique de la note (clé primaire). |
| `score`         | INT       | Valeur de la note (de 1 à 5).                 |
| `id_user`       | INT       | Identifiant de l'utilisateur ayant donné la note (clé étrangère vers **USER**). |
| `id_recipe`     | INT       | Identifiant de la recette notée (clé étrangère vers **RECIPE**). |

---