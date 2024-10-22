export class RecipeCard {
  constructor(recipe) {
    this.recipe = recipe;

    this.$wrapper = document.createElement('article');
  }

  createRecipeCard() {
    const recipeCard = `
    <article class="recipe">
        <img src="./assets/${this.recipe.image}" alt="${
      this.recipe.name
    }" class="recipe-image">
        <div class="recipe-details">
            <h2 class="recipe-title">${this.recipe.name}</h2>
            <p class="recipe-time">${this.recipe.time} minutes</p>
            <h3 class="recipe-subtitle">RECETTE</h3>
             <p class="recipe-description">appliance: ${
               this.recipe.appliance
             }</p>
             <p class="recipe-description">ustensils: ${
               this.recipe.ustensils
             }</p>
            <p class="recipe-description">${this.recipe.description}</p>
            <h3 class="recipe-subtitle">INGRÉDIENT</h3>
            <ul class="recipe-ingredients">
            ${this.recipe.ingredients
              .map((ingredient) => {
                let ingredientInfo = '';
                if (ingredient.quantity) {
                  ingredientInfo += ingredient.quantity + ' ';
                }
                if (ingredient.unit) {
                  ingredientInfo += ingredient.unit;
                }
                return `<li>
              <span class="recipe-ingredient-name">${ingredient.ingredient}</span>
              <span class="text-gray-500">${ingredientInfo}</span>
              </li>`;
              })
              .join('')}
            </ul>
        </div>
    </article>
    `;
    this.$wrapper.innerHTML = recipeCard;
    return this.$wrapper;
  }
}
