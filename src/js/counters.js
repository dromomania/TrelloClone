function countSumTodoCards(data) {
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

function countSumInProgressCards(data) {
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


function countSumDoneCards(data) {
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

export { countSumDoneCards, countSumTodoCards, countSumInProgressCards }
