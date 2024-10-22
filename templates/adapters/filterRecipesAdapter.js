export class FilterRecipesAdapter {
  constructor(recipes, listeFilters) {
    this.recipes = recipes;
    this.listeTagsFilters = listeFilters;

    this.filterIngredients = [];
    this.filterAppliance = [];
    this.filterUstensils = [];
  }
  // filtre les recettes par rapport aux filtres
  filterByItems() {
    const newListeRecipes = [];

    if (this.listeTagsFilters.length === 0) {
      return this.recipes;
    }

    this.recipes.forEach((recipe) => {
      const ingredients = recipe.ingredients.map(
        (ingredient) => ingredient.ingredient
      );
      const ustensils = recipe.ustensils;
      const appliance = recipe.appliance;

      const allFilters = [...ingredients, ...ustensils];

      allFilters.push(appliance);

      const isRecipeValid = this.listeTagsFilters.every((filter) =>
        allFilters.includes(filter)
      );

      if (isRecipeValid) {
        newListeRecipes.push(recipe);
      }
    });
    return newListeRecipes;
  }

  // récupère la liste des filtres
  findListeFilters(listRecipes, typeList) {
    const liste = [];
    listRecipes.forEach((recipe) => {
      if (typeList === 'ingredients') {
        recipe[typeList].forEach((item) => {
          liste.push(item.ingredient);
        });
      } else if (typeList === 'ustensils') {
        recipe[typeList].forEach((item) => {
          liste.push(item);
        });
      } else {
        liste.push(recipe[typeList]);
      }
    });

    // supprime les doublons
    let listeUnique = liste.filter((item, index) => {
      return liste.indexOf(item) === index;
    });

    // on supprime de la liste les items déjà présents dans le tableau de filtres
    listeUnique = listeUnique.filter((item) => {
      return !this.listeTagsFilters.includes(item);
    });

    // trie les items
    return listeUnique.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }
}
