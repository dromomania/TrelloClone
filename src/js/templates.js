
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

export { buildCardTemplate, buildDropdownTemplate }
