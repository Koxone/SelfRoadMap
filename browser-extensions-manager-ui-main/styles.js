//Global Variables
let activeCards = []

//Local Storage Variables
let getActiveCards = JSON.parse(localStorage.getItem('getCards')) || []

//Quick Test Section
console.log('Prueba Local Storage:', getActiveCards)

//Function to update UI with Active Extensions
function updateUI() {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    let cardId = card.querySelector('input[type="checkbox"]').id

    if (getActiveCards.includes(cardId)) {
      card.classList.add('active')
      card.querySelector('input[type="checkbox"]').checked = true
    } else {
      card.classList.remove('active')
      card.querySelector('input[type="checkbox"]').checked = false
    }
  })
}
updateUI()

//Function to handle active status on each extension
function handleToggleActiveStatus() {
  const inputs = document.querySelectorAll('.checkbox')
  inputs.forEach((input) => {
    input.addEventListener('change', (event) => {
      let target = event.target
      let closest = target.closest('.card')
      let inputId = input.id

      if (input.checked) {
        closest.classList.add('active')
        console.log('Toggle ON:', inputId)

        if (!activeCards.includes(inputId)) {
          getActiveCards.push(inputId)
          localStorage.setItem('getCards', JSON.stringify(getActiveCards))
          console.log('Active Cards:', getActiveCards)
        }
      } else {
        closest.classList.remove('active')
        console.log('Toggle OFF:', inputId)
        getActiveCards = getActiveCards.filter((id) => id !== inputId)
        localStorage.setItem('getCards', JSON.stringify(getActiveCards))
      }
    })
  })
}
handleToggleActiveStatus()

//Function to handle filter
function filterActive() {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    if (card.classList.contains('active')) {
      card.style.display = 'flex'
    } else if (!card.classList.contains('active')) {
      card.style.display = 'none'
    }
  })
}

function filterInactive() {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    if (!card.classList.contains('active')) {
      card.style.display = 'flex'
    } else if (card.classList.contains('active')) {
      card.style.display = 'none'
    }
  })
}

function filterAll() {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    card.style.display = 'flex'
  })
}

//Function to handle filter active status
function handleFilterActiveStatus() {
  const radios = document.querySelectorAll('.radio')

  radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      radios.forEach((r) => {
        r.nextElementSibling.classList.remove('active')
      })
      let target = event.target
      let id = target.id
      if (target.checked) {
        target.nextElementSibling.classList.add('active')
        console.log('Prueba ID:', radio.id)
      }
      if (radio.id === 'active') {
        filterActive()
        console.log('Funciona')
      } else if (radio.id === 'all') {
        filterAll()
      } else if (radio.id === 'inactive') {
        filterInactive()
      }
    })
  })
}
handleFilterActiveStatus()

//Function for Remove Button
function removeButton() {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    const removeButton = card.querySelector('button')
    removeButton.addEventListener('click', () => {
        let result = confirm('This extension is gonna be removed, this action cannot be undone');
        if (result) {
            card.style.display = 'none'
        }
    })
  })
}
removeButton()
