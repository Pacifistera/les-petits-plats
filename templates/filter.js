import { RecipeCard } from './recipeCard.js';

export class Filter {
  constructor(recipes) {
    this.recipes = recipes;
    this.filterByItems = [];

    this.$filterContainer = document.querySelector('.filters');
    this.$filterWrapper = document.createElement('div');
    this.$filterWrapper.classList.add('filters-container');
    this.$blocResultFilter = document.createElement('div');
    this.$blocResultFilter.classList.add('result-filter');
    this.$recipesWrapper = document.getElementById('recipes');
  }

  filterRecipes() {
    this.clearRecipesWrapper();

    // si pas de recipes msg spécifique

    this.recipes.forEach((recipe) => {
      const Template = new RecipeCard(recipe);
      this.$recipesWrapper.appendChild(Template.createRecipeCard());
    });
  }

  onActivationFilter(type) {
    const divExpend = this.$filterWrapper.querySelector(
      `.filter-${type} .div-expend`
    );
    this.$filterWrapper
      .querySelector(`.filter-${type} .button`)
      .addEventListener('click', (e) => {
        const filters = document.querySelectorAll('.div-expend');
        filters.forEach((div) => {
          if (div === divExpend) {
            divExpend.classList.toggle('active');
          } else {
            div.classList.remove('active');
          }
        });
      });
  }

  findListeFilters(typeList) {
    const liste = [];
    this.recipes.forEach((recipe) => {
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
    const listeUnique = liste.filter((item, index) => {
      return liste.indexOf(item) === index;
    });
    // trie les items
    return listeUnique.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }

  createFilterIngredients() {
    const listeIngredients = this.findListeFilters('ingredients');
    const filterContainer = `
    <div class="filter-ingredients">
        <button class="button">
            <span>Ingrédients</span>
            <i class="fa-solid fa-caret-down"></i>
        </button>
        <div class="div-expend">
        <div class="div-input">
            <input type="search" placeholder="Rechercher un ingrédient">
        </div>
        <ul class="liste-filters">
        ${listeIngredients
          .map((ingredient) => `<li>${ingredient}</li>`)
          .join('')}
        </ul>
    </div>
    `;

    return filterContainer;
  }

  createFilterAppareil() {
    const listeAppareil = this.findListeFilters('appliance');
    const filterContainer = `
    <div class="filter-appliance">
    <button class="button">
    <span>Appareils</span>
    <i class="fa-solid fa-caret-down"></i>
    </button>
    <div class="div-expend">
    <div class="div-input">
    <input type="search" placeholder="Rechercher un appareil">
    </div>
    <ul class="liste-filters">
        ${listeAppareil.map((appareil) => `<li>${appareil}</li>`).join('')}
        </ul>
    </div>
    `;

    return filterContainer;
  }

  createFilterUstensils() {
    const listeUstensils = this.findListeFilters('ustensils');

    const filterContainer = `
    <div class="filter-ustensils">
    <button class="button">
    <span>Ustensiles</span>
    <i class="fa-solid fa-caret-down"></i>
    </button>
    <div class="div-expend">
    <div class="div-input">
    <input type="search" placeholder="Rechercher un ustensile">
    </div>
    <ul class="liste-filters">
        ${listeUstensils.map((ustensil) => `<li>${ustensil}</li>`).join('')}
        </ul>
    </div>
    `;

    return filterContainer;
  }

  createAllFilters() {
    // creation des blocs filters
    this.$filterWrapper.innerHTML += this.createFilterIngredients();
    this.$filterWrapper.innerHTML += this.createFilterAppareil();
    this.$filterWrapper.innerHTML += this.createFilterUstensils();

    // activation des .div-expend
    this.onActivationFilter('ingredients');
    this.onActivationFilter('appliance');
    this.onActivationFilter('ustensils');

    // recherche input filtre
    this.searchFilterByType('ingredients');
    this.searchFilterByType('appliance');
    this.searchFilterByType('ustensils');

    this.$filterContainer.appendChild(this.$filterWrapper);
    this.$filterContainer.appendChild(this.$blocResultFilter);

    // ajout des tags au click
    this.onSelectedFilter('ingredients');
  }

  onSelectedFilter(type) {
    const listFilters = this.$filterWrapper.querySelectorAll(
      `.filter-${type} ul li`
    );

    listFilters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        // on lance la recherche de la recette par rapport au tag ajouté
        this.createTagFilter(e.target.textContent);
        const listeTag = this.getListeTag();

        // recherche les recettes par rapport aux tags ajoutés
        const filteredRecipes = this.recipes.filter((recipe) => {
          return recipe.ingredients.some((ingredient) => {
            return ingredient.ingredient.includes(e.target.textContent);
          });
        });

        // on supprime le tag ajouté  de la liste
        filter.parentElement.removeChild(filter);

        // on update la liste des recettes par rapport aux tags
        this.recipes = filteredRecipes;

        // on re render l'affichage des recettes
        this.filterRecipes();

        // on ferme la div-expend

        this.$filterWrapper
          .querySelector(`.filter-${type} .div-expend`)
          .classList.remove('active');
      });
    });
  }

  searchNewRecipes() {
    const filteredRecipes = this.recipes.reduce();
  }

  // chercher filter ingredients

  searchFilterByType(type) {
    const inputByType = this.$filterWrapper.querySelector(
      `.filter-${type} input`
    );

    inputByType.addEventListener('input', (e) => {
      const searchFilterValue = e.target.value.toLowerCase();
      this.getElementFiltersBySearch(searchFilterValue, type);
    });
  }

  createTagFilter(item) {
    this.$blocResultFilter.innerHTML += `<p class="result-filter-element">${item}<i class="fa-solid fa-x"></i></p>`;

    if (!this.filterByItems.includes(item)) {
      this.filterByItems.push(item);
    }

    const removeFilter = document.querySelectorAll('.fa-x');
    removeFilter.forEach((el) => {
      el.addEventListener('click', () => {
        this.$blocResultFilter.removeChild(el.parentElement);
        this.filterByItems = this.filterByItems.filter((filterItem) => {
          console.log(filterItem, el.parentElement.textContent);
          return filterItem !== el.parentElement.textContent;
        });

        // refresh les recettes
        this.recipes = this.recipes.filter((recipe) => {
          return recipe.ingredients.some((ingredient) => {
            return ingredient.ingredient.includes(item);
          });
        });

        console.log('this.recipes in filter', this.recipes);

        // refresh la liste des recipes par filtre
        this.filterRecipes();
      });
    });
  }

  clearRecipesWrapper() {
    this.$recipesWrapper.innerHTML = '';
  }

  getElementFiltersBySearch(searchElementFilter, type) {
    const listElement = this.findListeFilters(type);
    let listElementsBySearch = [];

    if (type === 'ingredient') {
    } else {
      listElementsBySearch = listElement.filter((el) => {
        return el.toLowerCase().includes(searchElementFilter);
      });
    }

    const blocListe = this.$filterWrapper.querySelector(`.filter-${type} ul`);
    blocListe.innerHTML = '';

    const newListe = `
        <ul class="liste-filters">
        ${listElementsBySearch.map((el) => `<li>${el}</li>`).join('')}
        </ul>
    `;
    blocListe.innerHTML = newListe;
  }

  getListeTag() {
    return this.filterByItems;
  }
}
