import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import bookmarksView from './views/bookmarksView.js'
import paginationView from './views/paginationView.js'
import AddRecipeView from './views/AddRecipeView.js'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import addRecipeView from './views/AddRecipeView.js'

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

    // 1. updating bookmarks view
    bookmarksView.update(model.state.bookmarks)

    // 2. loading recipe
    await model.loadRecipe(id)

    // 3. rendering recipe
    recipeView.render(model.state.recipe)
  } catch(err) {
    recipeView.renderError()
    console.log(err);
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

const controlAddBookmark = function() {
  // 1) Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) update the recipe view
  recipeView.update(model.state.recipe)

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // upload the new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe)
    
    // Success message 
    AddRecipeView.renderMessage()

    // rerender bookmark view
    bookmarksView.render(model.state.bookmarks)

    // change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close modal window
    setTimeout(() => {
      AddRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error('🎃', err);
    AddRecipeView.renderError(err.message)
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
