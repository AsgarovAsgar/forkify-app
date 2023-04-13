import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

if (module.hot) {
  module.hot.accept()
}

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1)
    if(!id) return

    recipeView.renderSpinner()

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // 1. loading recipe
    await model.loadRecipe(id)

    // 2. rendering recipe
    recipeView.render(model.state.recipe)
    // controlServings()
  } catch(err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function() { // this is subscriber function
  try {
    // 1) Get search query
    const query = searchView.getQuery()
    if(!query) return

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())

    // 4) render initial pagination buttons
    paginationView.render(model.state.search)

  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) { // this is subscriber function
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function(newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings)

  // update the recipe view
  recipeView.update(model.state.recipe)
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerUpdateServings(controlServings)
}

init()
