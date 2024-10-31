import { recipesData } from './api/recipes.js';
import { Search } from './search.js';

class RecipeApp {
  constructor() {
    // récupérer le bloc container des recettes
    this.$recipesContainer = document.getElementById('recipes');
    // this.recipes = tableau init sans valeurs
    this.recipes = recipesData;
  }

  // function init
  init() {
    // recherche une recette par son nom ou par un ingredient ou par la description
    const search = new Search(this.recipes);
    search.init();
    debugger;
  }
}

// initialisation de la class recipeApp
const recipeApp = new RecipeApp();
// call de la fonction init
recipeApp.init();
