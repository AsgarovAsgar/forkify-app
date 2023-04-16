import View from './View.js'
import previewView from './previewView.js'
import icons from 'url:../../img/icons.svg'

class Bookmarks extends View {
  _parentElement = document.querySelector('.bookmarks__list')
  _errorMessage = 'No bookmarks yet. Find a nice and bookmark it'
  _message = ''

  addHandlerRender(handler) {
    window.addEventListener('load', handler)
  }

  _generateMarkup() {
    return this._data.map(boo => previewView.render(boo, false)).join('')
  }
}

export default new Bookmarks()