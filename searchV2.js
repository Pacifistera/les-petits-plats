import { FilterNew } from './templates/filterNew.js';

export class SearchV2 {
  constructor(recipesData) {
    this.searchBar = document.getElementById('searchBar');
    this.originalRecipes = recipesData;
  }

  init() {
    const filtres = new FilterNew(this.originalRecipes);
    filtres.renderFilter();

    this.searchBar.addEventListener('input', (e) => {
      const searchValue = e.target.value.toLowerCase();

      if (searchValue.length > 3) {
        // // const filteredRecipes = this.originalRecipes.filter((recipe) => {
        //   return (
        //     recipe.name.toLowerCase().includes(searchValue) ||
        //     recipe.ingredients.some((ingredient) =>
        //       ingredient.ingredient.toLowerCase().includes(searchValue)
        //     ) ||
        //     recipe.description.toLowerCase().includes(searchValue)
        //   );
        // });

        const newFilteredRecipes = [];

        for (let i = 0; i < this.originalRecipes.length; i++) {
          if (
            this.originalRecipes[i].name.toLowerCase().includes(searchValue) ||
            this.originalRecipes[i].ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(searchValue)
            ) ||
            this.originalRecipes[i].description
              .toLowerCase()
              .includes(searchValue)
          ) {
            newFilteredRecipes.push(this.originalRecipes[i]);
          }
        }

        console.log('filteredRecipes', newFilteredRecipes);

        filtres.recipes = newFilteredRecipes;

        filtres.filterRecipes();
      }

      if (searchValue.length === 0) {
        filtres.recipes = this.originalRecipes;
        filtres.renderFilter();
      }
    });
  }
}
