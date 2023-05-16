import { $, renderCards, renderUsers, getData, setData } from './helpers'
import { TodoCard } from './constructor'
import { countSumDoneCards, countSumTodoCards, countSumInProgressCards } from './counters'
import { currentTime } from './clock'

currentTime()

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
const dropdownMenuEditElement = $('#dropdownMenuEdit')
const deleteCardButtonElement = $('#deleteCardButton')
const rowElement = $('#row')
const modalTitleEditElement = $('#modalTitleEdit')
const modalDescriptionEditElement = $('#modalDescriptionEdit')
const confirmButtonEditElement = $('#confirmEdit')
const dropdownEditElement = $('#dropdownEdit')
const sumCardsElement = $('#sumCards')
const numberInProgressCardsElement = $('#numberInProgressCards')
const numberDoneCardsElement = $('#numberDoneCards')
const btnModalDeleteAllConfirmElement = $('#btnModalDeleteAllConfirm')
const modalElement = $('#modalProhibition')
const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement)


renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
sumCardsElement.innerHTML = countSumTodoCards(data)
numberInProgressCardsElement.innerHTML = countSumInProgressCards(data)
numberDoneCardsElement.innerHTML = countSumDoneCards(data)


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
dropdownMenuElement.addEventListener('click', handleSetSelectedUserName)
dropdownEditElement.addEventListener('click', handleDropdownEditOpen)
dropdownMenuEditElement.addEventListener('click', handleSetSelectedUserNameEdit)


rowElement.addEventListener('click', handleEditCard)
deleteCardButtonElement.addEventListener('click', handleDeleteCard)
inProgressColumnElement.addEventListener('dragover', handleAllowDrop)
inProgressColumnElement.addEventListener('drop', handleDropInProgress)
doneColumnElement.addEventListener('dragover', handleAllowDropInDone)
doneColumnElement.addEventListener('drop', handleDropInDone)
btnModalDeleteAllConfirmElement.addEventListener('click', handleDeleteAllDoneCards)
window.addEventListener('beforeunload', handleBeforeUnload)
confirmButtonEditElement.addEventListener('click', handleEditConfirmation)


// handlers
function handleConfirmation(event) {
  const card = new TodoCard(modalTitleElement.value, modalDescriptionElement.value, dropdownElement.innerHTML, 'ToDo')
  data.push(card)

  renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
  sumCardsElement.innerHTML = countSumTodoCards(data)

  modalTitleElement.value = ''
  modalDescriptionElement.value = ''
  dropdownElement.innerHTML = 'Select user'
}

function handleEditConfirmation(event) {
  const { target } = event
  const { role, id } = target.dataset

  if (role == 'confirm') {
    const card = data.find((item) => item.id == id)
    card.title = modalTitleEditElement.value
    card.description = modalDescriptionEditElement.value
    card.user = dropdownEditElement.innerHTML

    renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)
  }

}

function handleDropdownOpen(event) {
  renderUsers(users, dropdownMenuElement)
}

function handleDropdownEditOpen(event) {
  renderUsers(users, dropdownMenuEditElement)
}

function handleSetSelectedUserName(event) {
  let name = event.target
  dropdownElement.innerHTML = name.innerHTML

}

function handleSetSelectedUserNameEdit(event) {
  let name = event.target
  dropdownEditElement.innerHTML = name.innerHTML

}

function handleEditCard(event) {
  const { target } = event           // заполняем модальное окно данными карточки
  const { role, id } = target.dataset

  if (role == 'edit') {
    const targetCard = data.find((item) => item.id == id)
    modalTitleEditElement.value = targetCard.title
    modalDescriptionEditElement.value = targetCard.description
    dropdownEditElement.innerHTML = targetCard.user

    deleteCardButtonElement.setAttribute('data-id', `${targetCard.id}`)
    confirmButtonEditElement.setAttribute('data-id', `${targetCard.id}`)
  }

}

function handleDeleteCard(event) {
  const { target } = event
  const { role, id } = target.dataset

  if (role == 'delete') {
    data = data.filter((item) => item.id != id)
    renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)

    sumCardsElement.innerHTML = countSumTodoCards(data)
    numberInProgressCardsElement.innerHTML = countSumInProgressCards(data)
    numberDoneCardsElement.innerHTML = countSumDoneCards(data)
  }
}

function handleAllowDrop(event) {
  if (countSumInProgressCards(data) < 6) {
    event.preventDefault()
  } else {
    modalInstance.show()
  }
}

function handleDrag(event) {
  event.dataTransfer.setData('id', event.target.id)
  //console.log(event.target.id)
}

function handleDropInProgress(event) {              //!!!!
  let itemId = event.dataTransfer.getData('id')
  inProgressWrapElement.append($(`#${itemId}`))

  let cardItemId = itemId.substring(1) // чтобы обрезать в id="c${cardItem.id} чтобы найти карточку
  const draggedCard = data.find((item) => item.id == cardItemId)
  draggedCard.status = 'In Progress'

  sumCardsElement.innerHTML = countSumTodoCards(data)
  numberInProgressCardsElement.innerHTML = countSumInProgressCards(data)
  numberDoneCardsElement.innerHTML = countSumDoneCards(data)
}

function handleAllowDropInDone(event) {
  event.preventDefault()
}

function handleDropInDone(event) {
  let itemId = event.dataTransfer.getData('id')
  doneWrapElement.append($(`#${itemId}`))

  let cardItemId = itemId.substring(1)
  const draggedCard = data.find((item) => item.id == cardItemId)
  draggedCard.status = 'Done'

  sumCardsElement.innerHTML = countSumTodoCards(data)
  numberInProgressCardsElement.innerHTML = countSumInProgressCards(data)
  numberDoneCardsElement.innerHTML = countSumDoneCards(data)
}

function handleDeleteAllDoneCards() {

  data = data.filter((item) => item.status != 'Done')
  renderCards(data, todoWrapElement, inProgressWrapElement, doneWrapElement)

  sumCardsElement.innerHTML = countSumTodoCards(data)
  numberInProgressCardsElement.innerHTML = countSumInProgressCards(data)
  numberDoneCardsElement.innerHTML = countSumDoneCards(data)
}

function handleBeforeUnload() {
  setData(data)
}


export { handleDrag }
