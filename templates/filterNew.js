import { RecipeCard } from './recipeCard.js';
import { FilterRecipesAdapter } from './adapters/filterRecipesAdapter.js';

export class FilterNew {
  constructor(recipes) {
    this.recipes = recipes;
    this.filters = [];
    this.listeIngredients = [];
    this.listeAppliance = [];
    this.listeUstensils = [];

    this.$filterContainer = document.querySelector('.filters');
    this.$filterWrapper = document.createElement('div');
    this.$filterWrapper.classList.add('filters-container');
    this.$recipesWrapper = document.getElementById('recipes');

    this.$blocResultFilter = document.createElement('div');
    this.$blocResultFilter.classList.add('result-filter');

    this.$noResult = document.createElement('div');
    this.$noResult.classList.add('no-result');
    this.$recipesWrapper.appendChild(this.$noResult);

    this.$blocNbRecipes = document.createElement('div');
    this.$blocNbRecipes.classList.add('nb-recipes');

    this.userSearch = '';
  }

  // affiche le nombre de recettes
  updateNbRecipes(nbRecipes) {
    this.$blocNbRecipes.innerHTML = `<p>${nbRecipes} recette${
      nbRecipes > 1 ? 's' : ''
    }</p>`;
  }

  // filtre les recettes par rapport aux filtres
  filterRecipes() {
    const adaptedFilter = new FilterRecipesAdapter(this.recipes, this.filters);
    const filteredRecipes = adaptedFilter.filterByItems();

    this.renderListeRecipes(filteredRecipes);

    this.updateNbRecipes(filteredRecipes.length);

    this.listeIngredients = adaptedFilter.findListeFilters(
      filteredRecipes,
      'ingredients'
    );
    this.listeAppliance = adaptedFilter.findListeFilters(
      filteredRecipes,
      'appliance'
    );
    this.listeUstensils = adaptedFilter.findListeFilters(
      filteredRecipes,
      'ustensils'
    );

    this.renderListeFilter(this.listeIngredients, 'ingredients');
    this.renderListeFilter(this.listeAppliance, 'appliance');
    this.renderListeFilter(this.listeUstensils, 'ustensils');
  }

  // vide le contenu de la section des recettes
  clearRecipesWrapper() {
    this.$recipesWrapper.innerHTML = '';
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
    const listeUnique = liste.filter((item, index) => {
      return liste.indexOf(item) === index;
    });
    // trie les items
    return listeUnique.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }
  // affiche les filtres et les developpent
  onActivationExpendFilter() {
    const allFiltersBloc = this.$filterWrapper.querySelectorAll(
      '.filters-container .bloc-filter'
    );

    allFiltersBloc.forEach((blocFilter) => {
      const button = blocFilter.querySelector('.button');
      button.addEventListener('click', (e) => {
        e.stopPropagation();

        // on ferme tous les filtres
        allFiltersBloc.forEach((bloc) => {
          if (bloc !== blocFilter) {
            console.log('bloc !== blocFilter');
            bloc.querySelector('.div-expend').classList.remove('active');
          }
        });

        // on ouvre le filtre cliqué
        blocFilter.querySelector('.div-expend').classList.toggle('active');
      });
    });
  }

  // ajoute un filtre
  onSelectedFilter() {
    const allFiltersListe =
      this.$filterWrapper.querySelectorAll('.liste-filters');

    allFiltersListe.forEach((liste) => {
      liste.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          const filter = e.target.textContent;

          const divExpend = liste.parentElement;
          divExpend.classList.remove('active');

          this.addFilter(filter);
          this.filterRecipes();
        }
      });
    });
  }

  addActiveFilter(filter) {
    const filterIndex = this.filters.indexOf(filter);

    if (filterIndex === -1) {
      this.filters.push(filter);
    }
  }

  removeActiveFilter(filter) {
    const filterIndex = this.filters.indexOf(filter);

    if (filterIndex !== -1) {
      this.filters.splice(filterIndex, 1);
    }
  }

  // ajoute un filtre dans le bloc de résultat
  addFilter(filter) {
    this.$blocResultFilter.innerHTML += `<p class="result-filter-element">${filter}<i class="fa-solid fa-x"></i></p>`;

    this.addActiveFilter(filter);

    const removeFilter = document.querySelectorAll('.fa-x');
    removeFilter.forEach((el) => {
      el.addEventListener('click', (e) => {
        const filterToRemove = e.target.previousSibling.textContent;

        e.target.parentNode.remove();
        this.removeActiveFilter(filterToRemove);
        this.filterRecipes();
      });
    });
  }

  renderListeFilter(list, typeFilter) {
    const listeOrder = list.sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    const contentListeFilter = `${listeOrder
      .map((item) => `<li>${item}</li>`)
      .join('')}`;

    const filterContainerUl = this.$filterWrapper.querySelector(
      `.filter-${typeFilter} .liste-filters`
    );

    filterContainerUl.innerHTML = contentListeFilter;
  }

  onSearchFilter() {
    const allFiltersListe = this.$filterWrapper.querySelectorAll(
      '.filters-container div.bloc-filter'
    );

    allFiltersListe.forEach((liste) => {
      const divInput = liste.querySelector('.div-input input');
      divInput.addEventListener('input', (e) => {
        const listeFilters = liste.querySelectorAll('.liste-filters li');

        const searchValue = e.target.value.toLowerCase();

        listeFilters.forEach((item) => {
          if (item.textContent.toLowerCase().includes(searchValue)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  renderListeRecipes(listRecipes) {
    if (listRecipes.length === 0) {
      this.$noResult = `<p>Aucune recette ne correspond à votre recherche <strong>"${this.userSearch}"</strong> vous pouvez chercher «
tarte aux pommes », « poisson », etc. </p>`;
      this.$recipesWrapper.innerHTML = this.$noResult;
    } else {
      this.$recipesWrapper.innerHTML = '';
      listRecipes.forEach((recipe) => {
        const templateRecipe = new RecipeCard(recipe);
        this.$recipesWrapper.appendChild(templateRecipe.createRecipeCard());
      });
    }
  }

  // affiche les filtres et les developpent et les recettes
  renderFilter() {
    this.renderListeRecipes(this.recipes);

    const listeIngredients = this.findListeFilters(this.recipes, 'ingredients');
    const listeAppliance = this.findListeFilters(this.recipes, 'appliance');
    const listeUstensils = this.findListeFilters(this.recipes, 'ustensils');

    const filterContainerIngredients = `
		<div class="bloc-filter filter-ingredients">
		    <button class="button">
		        <span>Ingrédients</span>
		        <i class="fa-solid fa-caret-down"></i>
		    </button>
		    <div class="div-expend">
		    <div class="div-input">
		        <input type="search" placeholder="Rechercher un ingrédient">
		    </div>
		    <ul class="liste-filters">
		    </ul>
		</div>
		`;

    const filterContainerAppliance = `
		<div class="bloc-filter filter-appliance">
		    <button class="button">
		        <span>Appareil</span>
		        <i class="fa-solid fa-caret-down"></i>
		    </button>
		    <div class="div-expend">
			<div class="div-input">
				<input type="search" placeholder="Rechercher un appareil">
			</div>
			<ul class="liste-filters">
			</ul>
		</div>
		`;

    const filterContainerUstensils = `
		<div class="bloc-filter filter-ustensils">	
			<button class="button">
				<span>Ustensiles</span>
				<i class="fa-solid fa-caret-down"></i>
			</button>
			<div class="div-expend">
			<div class="div-input">
				<input type="search" placeholder="Rechercher un ustensile">
			</div>
			<ul class="liste-filters">
			</ul>
		</div>	
		`;

    this.updateNbRecipes(this.recipes.length);

    this.listeIngredients = listeIngredients;
    this.listeAppliance = listeAppliance;
    this.listeUstensils = listeUstensils;

    this.$filterWrapper.innerHTML = filterContainerIngredients;
    this.$filterWrapper.innerHTML += filterContainerAppliance;
    this.$filterWrapper.innerHTML += filterContainerUstensils;

    this.$filterContainer.appendChild(this.$filterWrapper);
    this.$filterContainer.appendChild(this.$blocNbRecipes);
    this.$filterContainer.appendChild(this.$blocResultFilter);

    this.renderListeFilter(this.listeIngredients, 'ingredients');
    this.renderListeFilter(this.listeAppliance, 'appliance');
    this.renderListeFilter(this.listeUstensils, 'ustensils');

    this.onSearchFilter();

    this.onActivationExpendFilter();

    this.onSelectedFilter();
  }
}
