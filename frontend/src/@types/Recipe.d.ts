
  // src/types/Recipe.ts
  
// Interface pour une Catégorie
export interface ICategory {
  _id: string;       // Identifiant unique généré par Mongoose
  name: string;        // Nom de la catégorie (obligatoire)
  createdAt: string;     // Date de création de la catégorie
  updatedAt: string;     // Date de la dernière mise à jour de la catégorie
}

// Optionnel : Interface pour la création d'une catégorie (sans l'_id, createdAt, updatedAt)
export interface ICreateCategory {
  name: string;        // Nom de la catégorie
}
  
// Interface pour un Ingrédient
export interface IIngredient {
  _id: string;             // Identifiant unique généré par Mongoose
  name: string;              // Nom de l'ingrédient (obligatoire)
  quantity?: number | string; // Quantité de l'ingrédient (peut être un nombre ou une chaîne pour des quantités spécifiques)
  quantity_description?: string; // Description de la quantité (par exemple, "au goût")
  unit: string;              // Unité de mesure (obligatoire)
  createdAt: string;           // Date de création de l'ingrédient
  updatedAt: string;           // Date de la dernière mise à jour de l'ingrédient
}

// Optionnel : Interface pour la création d'un ingrédient (sans l'_id, createdAt, updatedAt)
export interface ICreateIngredient {
  name: string;              // Nom de l'ingrédient
  quantity?: number | string; // Quantité de l'ingrédient (peut être un nombre ou une chaîne)
  quantity_description?: string; // Description de la quantité (optionnel)
  unit: string;              // Unité de mesure de l'ingrédient
}
  
// Interface pour une Instruction
export interface IInstruction {
  _id: string;           // Identifiant unique généré par Mongoose
  step_number: number;     // Numéro de l'étape (obligatoire)
  instruction: string;     // Texte de l'instruction (obligatoire)
  createdAt: string;         // Date de création de l'instruction
  updatedAt: string;         // Date de la dernière mise à jour de l'instruction
}

// Optionnel : Interface pour la création d'une instruction (sans l'_id, createdAt, updatedAt)
export interface ICreateInstruction {
  step_number: number;     // Numéro de l'étape
  instruction: string;     // Texte de l'instruction
}
  
  export interface IRecipe {
    _id: string;
    title: string;
    description: string;
    anecdote: string;
    image?: string;
    category: Category;
    ingredients: Ingredient[];
    instructions: Instruction[];
    source: string;
    createdAt: string;
    popularity: number; // Utilisé pour déterminer la recette la plus populaire
  }

  export interface IRecipeState {
    recipes: IRecipe[];
    popularRecipe: IRecipe | null;
    error: string | null;
  }

// Optionnel : Interface pour la création d'une recette (sans l'_id, createdAt, updatedAt)
export interface ICreateRecipe {
  title: string;
  description: string;
  anecdote?: string;
  ingredients: Ingredient[];       // Liste des ingrédients (références vers des documents Ingredient)
  instructions: Instruction[];      // Liste des instructions (références vers des documents Instruction)
  source?: string;
  category: Category;            // Catégorie de la recette (référence vers un modèle Category)
  image?: string;                // Image de la recette (optionnel)
}
