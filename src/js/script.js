// variables

let data = []
data = getData()

let users = []

const modalTitleElement = $('#modalTitle')
const modalDescriptionElement = $('#modalDescription')
const confirmButtonElement = $('#confirm')
const todoWrapElement = $('#todoWrap')
const inProgressColumnElement = $('#inProgressColumn')
const inProgressWrapElement = $('#inProgressWrap')
const doneColumnElement = $('#doneColumn')
const doneWrapElement = $('#doneWrap')
const dropdownElement = $('#dropdown')
const dropdownMenuElement = $('#dropdownMenu')
const deleteCardButtonElement = $('#deleteCardButton')
const rowElement = $('#row')
const modalTitleEditElement = $('#modalTitleEdit')
const modalDescriptionEditElement = $('#modalDescriptionEdit')
const confirmButtonEditElement = $('#confirmEdit')
const dropdownEditElement = $('#dropdownEdit')
const sumCardsElement = $('#sumCards')
const numberInProgressCardsElement = $('#numberInProgressCards')
const numberDoneCardsElement = $('#numberDoneCards')
const buttonDeleteAllElement = $('buttonDeleteAll')
const btnModalDeleteAllConfirmElement = $('#btnModalDeleteAllConfirm')
const modalElement = $('#modalProhibition')
const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement)


renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
sumCardsElement.innerHTML = countSumTodoCards()
numberInProgressCardsElement.innerHTML = countSumInProgressCards()
numberDoneCardsElement.innerHTML = countSumDoneCards()

// local storage

function getData () {
  return JSON.parse(localStorage.getItem('data')) || []
}

function setData (source) {
  localStorage.setItem('data', JSON.stringify(source))
}

// time

function currentTime() {
  let date = new Date(); /* creating object of Date class */
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let midday = "AM";
  midday = (hour >= 12) ? "PM" : "AM"; /* assigning AM/PM */
  hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour); /* assigning hour in 12-hour format */
  hour = updateTime(hour);
  min = updateTime(min);
  sec = updateTime(sec);
  document.getElementById("clock").innerText = hour + " : " + min + " : " + sec + " " + midday; /* adding time to the div */
    var t = setTimeout(currentTime, 1000); /* setting timer */
}

function updateTime(k) { /* appending 0 before time elements if less than 10 */
  if (k < 10) {
    return "0" + k;
  }
  else {
    return k;
  }
}

currentTime();

// query
let promise = fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => response.json())
  .then((data) => {
    users = data.map(function (elem) {
      return elem.name
    })
  })


// listeners
confirmButtonElement.addEventListener('click', handleConfirmation)
dropdownElement.addEventListener('click', handleDropdownOpen)
dropdownMenuElement.addEventListener('click', handleWriteTargetValue)
rowElement.addEventListener('click', handleEditCard)
deleteCardButtonElement.addEventListener('click', handleDeleteCard)
inProgressColumnElement.addEventListener('dragover', handleAllowDrop)
inProgressColumnElement.addEventListener('drop', handleDropInProgress)
doneColumnElement.addEventListener('dragover', handleAllowDropInDone)
doneColumnElement.addEventListener('drop', handleDropInDone)
btnModalDeleteAllConfirmElement.addEventListener('click', handleDeleteAllDoneCards)
window.addEventListener('beforeunload', handleBeforeUnload)





// handlers
function handleConfirmation(event) {
  const card = new TodoCard(modalTitleElement.value, modalDescriptionElement.value, dropdownElement.innerHTML, 'ToDo')
  data.push(card)

  renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
  modalTitleElement.value = ''
  modalDescriptionElement.value = ''
  dropdownElement.innerHTML = 'Select user'
  sumCardsElement.innerHTML = countSumTodoCards()

  // const cardElement = $(`#c${card.id}`)
  // cardElement.addEventListener('dragstart', handleDrag)

}

function handleDropdownOpen(event) {
  renderUsers(users, dropdownMenuElement)
}

function handleWriteTargetValue(event) {
  let name = event.target
  dropdownElement.innerHTML = name.innerHTML

}

function handleEditCard(event) {
  const { target } = event
  const { role, id } = target.dataset

  if (role == 'edit') {
    const targetCard = data.find((item) => item.id == id)
    modalTitleEditElement.value = targetCard.title
    modalDescriptionEditElement.value = targetCard.description
    dropdownEditElement.innerHTML = targetCard.user
    deleteCardButtonElement.setAttribute('data-id', `${targetCard.id}`)
  }

}

function handleDeleteCard(event) {
  const { target } = event
  const { role, id } = target.dataset

  if (role == 'delete') {
    data = data.filter((item) => item.id != id)
    renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
    countSumTodoCards()
  }
}


function handleAllowDrop(event) {
  if (countSumInProgressCards() < 6) {
    event.preventDefault()
  } else {
     modalInstance.show()
  }
}

function handleDrag(event) {
  event.dataTransfer.setData('id', event.target.id)
  //console.log(event.target.id)
}

function handleDropInProgress(event) {
  let itemId = event.dataTransfer.getData('id')
  // console.log(itemId)
  // console.log($(`#c${itemId}`))
  inProgressWrapElement.append($(`#${itemId}`))

  let cardItemId = itemId.substring(1) // чтобы обрезать в id="c${cardItem.id} чтобы найти карточку
  const draggedCard = data.find((item) => item.id == cardItemId)
  draggedCard.status = 'In Progress'

  sumCardsElement.innerHTML = countSumTodoCards()
  numberInProgressCardsElement.innerHTML = countSumInProgressCards()
  numberDoneCardsElement.innerHTML = countSumDoneCards()
}

function handleAllowDropInDone(event) {
  event.preventDefault()
}

function handleDropInDone(event) {
  let itemId = event.dataTransfer.getData('id')
  // console.log(itemId)
  //console.log($(`#${itemId}`))
  doneWrapElement.append($(`#${itemId}`))

  let cardItemId = itemId.substring(1)
  const draggedCard = data.find((item) => item.id == cardItemId)
  draggedCard.status = 'Done'

  sumCardsElement.innerHTML = countSumTodoCards()
  numberInProgressCardsElement.innerHTML = countSumInProgressCards()
  numberDoneCardsElement.innerHTML = countSumDoneCards()
}

function handleDeleteAllDoneCards() {

  data = data.filter((item) => item.status != 'Done')
  renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)

  sumCardsElement.innerHTML = countSumTodoCards()
  numberInProgressCardsElement.innerHTML = countSumInProgressCards()
  numberDoneCardsElement.innerHTML = countSumDoneCards()
}

function handleBeforeUnload () {
  setData(data)
}

// templates

function buildCardTemplate(cardItem) {
  let localDate = new Date(cardItem.time).toLocaleString()
  return `
  <div id="c${cardItem.id}" class="d-flex flex-column rounded-3 px-3 py-2" draggable="true" style="background-color: rgb(228, 224, 162);">
            <div class="d-flex flex-row justify-content-between">
              <span>${cardItem.title}</span>
              <button data-id="${cardItem.id}" class="material-icons" data-bs-toggle="modal" data-bs-target="#modalEditCard" data-role="edit">more_vert</button>
            </div>
            <span>${cardItem.description}</span>
            <div class="d-flex gap-3 justify-content-between">
              <span>${cardItem.user}</span>
              <time>${localDate}</time>
            </div>
          </div>
  `
}

function buildDropdownTemplate(userName) {
  return `
  <li><a class="dropdown-item" href="#">${userName}</a></li>
  `
}



// constructors
function TodoCard(title, description, user, status) {
  this.title = title
  this.description = description
  this.user = user
  this.time = new Date().toISOString()
  this.id = new Date().getTime()
  this.status = status
}

// helpers
function $(selector) {
  return document.querySelector(selector)
}

function renderCards(collection, wrapperTodo, wrapperInProgress, wrapperDone) {
  let templateTodo = ''
  let templateInProgress = ''
  let templateDone = ''

  collection.forEach((item) => {
    const template = buildCardTemplate(item)
    console.log(item)
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


  collection.forEach((item) => {
    const cardElement = $(`#c${item.id}`)
    cardElement.addEventListener('dragstart', handleDrag)
  })
}

function renderUsers(collection, wrapper) {
  let templates = ''
  collection.forEach((item) => {
    const template = buildDropdownTemplate(item)

    templates += template
  })

  wrapper.innerHTML = templates
}

// other

function countSumTodoCards() {
  // let sumCards = data.length
  // return sumCardsElement.innerHTML = sumCards

  return data.filter(function (item) {
    if (item.status == 'ToDo') {
      return true
    } else {
      return false
    }
  }).length
}

function countSumInProgressCards() {
  // let amountChildren = inProgressWrapElement.children.length
  // // console.log(amountChildren)
  // return numberInProgressCardsElement.innerHTML = amountChildren

  return data.filter(function (item) {
    if (item.status == 'In Progress') {
      return true
    } else {
      return false
    }
  }).length
}


function countSumDoneCards() {
  // let amountChildren = doneWrapElement.children.length
  // // console.log(amountChildren)
  // return numberDoneCardsElement.innerHTML = amountChildren

  return data.filter(function (item) {
    if (item.status == 'Done') {
      return true
    } else {
      false
    }
  }).length
}
