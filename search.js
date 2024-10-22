import { FilterNew } from './templates/filterNew.js';

export class Search {
  constructor(recipesData) {
    this.searchBar = document.getElementById('searchBar');
    this.originalRecipes = recipesData;
  }

  init() {
    const filtres = new FilterNew(this.originalRecipes);
    filtres.renderFilter();

    this.searchBar.addEventListener('input', (e) => {
      const searchValue = e.target.value.toLowerCase();

      if (searchValue.length >= 3) {
        const filteredRecipes = this.originalRecipes.filter((recipe) => {
          return (
            recipe.name.toLowerCase().includes(searchValue) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(searchValue)
            ) ||
            recipe.description.toLowerCase().includes(searchValue)
          );
        });

        filtres.userSearch = searchValue;

        filtres.recipes = filteredRecipes;

        filtres.filterRecipes();
      }

      if (searchValue.length === 0) {
        console.log('pas de recherche', this.originalRecipes);
        filtres.recipes = this.originalRecipes;
        filtres.renderFilter();
      }
    });
  }
}
