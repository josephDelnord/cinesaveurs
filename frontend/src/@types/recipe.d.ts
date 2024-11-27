export interface ICategory {
    name: string;
  }
  
  export interface IIngredient {
    name: string;
    quantity: number;
    quantity_description: string;
    unit: string;
  }
  
  export interface IInstruction {
    step_number: number;
    instruction: string;
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
