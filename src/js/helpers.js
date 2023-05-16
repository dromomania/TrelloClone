import { buildCardTemplate, buildDropdownTemplate } from './templates'
import { handleDrag } from './script'


function $(selector) {
  return document.querySelector(selector)
}

function renderCards(collection, wrapperTodo, wrapperInProgress, wrapperDone) {
  let templateTodo = ''
  let templateInProgress = ''
  let templateDone = ''

  collection.forEach((item) => {
    const template = buildCardTemplate(item)
    //console.log(item)
    if (item.status == 'ToDo') {
      templateTodo += template
    } else if (item.status == 'In Progress') {
      templateInProgress += template
    } else if (item.status == 'Done') {
      templateDone += template
    }
  })

  wrapperTodo.innerHTML = templateTodo
  wrapperInProgress.innerHTML = templateInProgress
  wrapperDone.innerHTML = templateDone


  collection.forEach((item) => {    // чтобы карточка реагировала на drag
    const cardElement = $(`#c${item.id}`)
    cardElement.addEventListener('dragstart', handleDrag)
  })
}

function renderUsers(collection, wrapper) {
  let templates = ''
  collection.forEach((item) => {
    const template = buildDropdownTemplate(item) // создаем элемент списка дроп.

    templates += template
  })

  wrapper.innerHTML = templates
}

function getData () {
  return JSON.parse(localStorage.getItem('data')) || []
}

function setData (source) {
  localStorage.setItem('data', JSON.stringify(source))
}



export { $, renderCards, renderUsers, getData, setData }
