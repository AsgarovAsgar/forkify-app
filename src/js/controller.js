import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1)
    if(!id) return

    recipeView.renderSpinner()

    // 1. loading recipe
    await model.loadRecipe(id)

    // 2. rendering recipe
    recipeView.render(model.state.recipe)

  } catch(err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function() { // this is subscriber function
  try {
    const query = searchView.getQuery()
    if(!query) return

    await model.loadSearchResults(query)
    console.log('state.search', model.state.search);

  } catch (err) {
    console.log(err);
  }
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}

init()
