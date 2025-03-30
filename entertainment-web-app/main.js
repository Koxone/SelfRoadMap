//Global Variables
let jsonData = []

//Local Storage Variables

//Quick Test Section

//Function Go Home
function goHome() {
  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener('click', () => {
    window.location.href = '/'
  })
}
goHome()

//Function for Login Button
function loginButton() {
  const loginButton = document.getElementById('loginButton');
  const goToSignUp = document.getElementById('goToSignUp');
  const signUpScreen = document.getElementById('signUpScreen');
  const loginScreen = document.getElementById('loginScreen');

  loginButton.addEventListener('click', () => {

    const loginScreen = document.getElementById('loginScreen');
    const hide = document.querySelectorAll('.generalContainer, .headerContainer');
    const header = document.querySelector('header');
    const avatarButton = document.getElementById('avatarButton');

    hide.forEach(screen => {
      screen.style.display = 'flex'
    });
    loginScreen.style.display = 'none'
    header.style.display = 'block'

    avatarButton.addEventListener('click', () => {
      hide.forEach(screen => {
        screen.style.display = 'none'
      });
      loginScreen.style.display = 'flex'
      header.style.display = 'none'
    })
  })

  goToSignUp.addEventListener('click', () => {
    console.log('FUnciona')
    signUpScreen.style.display = 'flex'
    loginScreen.style.display = 'none'
  })
}
loginButton()

//Function for create  accountButton
function createAccountButton() {
  const createAccountButton = document.getElementById('createAccountButton');
  const goToLogin = document.getElementById('goToLogin');
  const loginScreen = document.getElementById('loginScreen');
  const signUpScreen = document.getElementById('signUpScreen');
  const show = document.querySelectorAll('.generalContainer, .headerContainer, header, .headerContainer');
  const avatarButton = document.getElementById('avatarButton');
  const header = document.querySelector('header');

  createAccountButton.addEventListener('click', () => {

    show.forEach((screen) => {
      screen.style.display = 'flex'
    })
    signUpScreen.style.display = 'none';
    loginScreen.style.display = 'none';
  })

  goToLogin.addEventListener('click', () => {
    signUpScreen.style.display = 'none'
    loginScreen.style.display = 'flex'
  })

  avatarButton.addEventListener('click', () => {
    show.forEach(screen => {
      screen.style.display = 'none'
    });
    loginScreen.style.display = 'flex'
    header.style.display = 'none'
  })
}
createAccountButton()

// Function to load JSON only once if not in localStorage
function loadJsonData(callBack) {
  const storedJson = localStorage.getItem('jsonData')

  if (storedJson) {
    jsonData = JSON.parse(storedJson)
    console.log('✅ JSON cargado desde localStorage')
    if (callBack) callBack()
  } else {
    fetch('data.json')
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        jsonData = data
        localStorage.setItem('jsonData', JSON.stringify(data))
        console.log('✅ JSON cargado desde archivo y guardado en localStorage')
        if (callBack) callBack()
      })
      .catch(function (error) {
        console.error('Error al cargar JSON:', error)
      })
  }
}
loadJsonData(function () {
  updateUi()
  filterMenu()
  toggleBookmark()
})

//Function to get data from JSON
function getJsonData() {
  fetch('data.json')
    .then(function (response) {
      console.log('Data fetched from JSON')
      return response.json()
    })
    .then(function (data) {
      jsonData = data
      localStorage.setItem('jsonData', JSON.stringify(data))
    })
    .catch(function (error) {
      console.log('Error found on getJsonData')
    })
}
getJsonData()

//Function to search into JSON File
function searchByTitle(titleToSearch) {
  if (!jsonData) {
    console.log('JSON Data Not Available')
    return null
  }
  return jsonData.find((item) => {
    return item.title.toLowerCase() === titleToSearch.toLowerCase()
  })
}

//Function for Card Images
function updateUi() {
  const tCards = document.querySelectorAll('.tCard')
  const cards = document.querySelectorAll('.card')

  tCards.forEach(function (tCard, index) {
    const data = jsonData[index]
    if (!data) return

    //Main Image
    const thumbnail = tCard.querySelector('.tCardThumbnail')
    if (data.thumbnail?.trending?.small) {
      thumbnail.setAttribute('src', data.thumbnail.trending.small)
      thumbnail.setAttribute('alt', data.title)
    }

    //Bookmark
    const bookmark = tCard.querySelector('.bookmarkTcard')
    if (bookmark) {
      const iconPath =
        data.isBookmarked === true
          ? './assets/icon-bookmark-full.svg'
          : './assets/icon-bookmark-empty.svg'
      bookmark.setAttribute('src', iconPath)
      bookmark.setAttribute('alt', data.isBookmarked)
    }

    //Year
    let tCardYear = tCard.querySelector('.tCardYear')
    tCardYear.textContent = data.year

    //Category Icon
    let tCardCategoryIcon = tCard.querySelector('.tCardCategoryIcon')
    if (tCardCategoryIcon) {
      const isMovie = data.category === 'Movie'
      const iconPath = isMovie
        ? './assets/icon-nav-movies.svg'
        : './assets/icon-nav-tv-series.svg'
      tCardCategoryIcon.setAttribute('src', iconPath)
      tCardCategoryIcon.setAttribute('alt', data.category)
    }

    //Category Text
    let tCardCategory = tCard.querySelector('.tCardCategory')
    tCardCategory.textContent = data.category

    //Title Text
    let tCardTitle = tCard.querySelector('.tCardTitle')
    tCardTitle.textContent = data.title

    //Rate Text
    let tCardRate = tCard.querySelector('.tCardRate')
    tCardRate.textContent = data.rating
  })

  cards.forEach(function (card, index) {
    const data = jsonData[index]
    if (!data) return

    //Main Image
    const thumbnail = card.querySelector('.cardThumbnail')
    if (data.thumbnail?.regular?.small) {
      thumbnail.setAttribute('src', data.thumbnail.regular.small)
      thumbnail.setAttribute('alt', data.title)
    }

    //Bookmark
    const bookmark = card.querySelector('.cardBookmark')
    const isBookmarked = data.isBookmarked === true
    if (bookmark) {
      const iconPath = isBookmarked
        ? './assets/icon-bookmark-full.svg'
        : './assets/icon-bookmark-empty.svg'
      bookmark.setAttribute('src', iconPath)
      bookmark.setAttribute('alt', data.isBookmarked)
      card.classList.remove('booked', 'notBooked')
      card.classList.add(isBookmarked ? 'booked' : 'notBooked')
    }

    //Year
    let cardYear = card.querySelector('.cardYear')
    cardYear.textContent = data.year

    //Category Icon
    let cardCategoryIcon = card.querySelector('.cardCategoryIcon')
    const isMovie = data.category === 'Movie'
    if (cardCategoryIcon) {
      const iconPath = isMovie
        ? './assets/icon-nav-movies.svg'
        : './assets/icon-nav-tv-series.svg'
      cardCategoryIcon.setAttribute('src', iconPath)
      cardCategoryIcon.setAttribute('alt', data.category)
      card.classList.remove('movie', 'tv')
      card.classList.add(isMovie ? 'movie' : 'tv')
    }

    //Category Text
    let cardCategory = card.querySelector('.cardCategory')
    cardCategory.textContent = data.category

    //Title Text
    let cardTitle = card.querySelector('.cardTitle')
    cardTitle.textContent = data.title

    //Rate Text
    let cardRate = card.querySelector('.cardRate')
    cardRate.textContent = data.rating
  })
}

//Function to handle filters
function filterMenu() {
  const menuButtons = document.querySelectorAll('.menuButton')
  const allCards = document.querySelectorAll('.movie, .tv')

  menuButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.id === 'tv') {
        allCards.forEach((card) => {
          if (card.classList.contains('movie')) {
            card.style.display = 'none'
          } else if (card.classList.contains('tv')) {
            card.style.display = 'flex'
          }
        })
      } else if (button.id === 'movie') {
        allCards.forEach((card) => {
          if (card.classList.contains('tv')) {
            card.style.display = 'none'
          } else if (card.classList.contains('movie')) {
            card.style.display = 'flex'
          }
        })
      } else if (button.id === 'home') {
        allCards.forEach((card) => {
          card.style.display = 'flex'
        })
      } else if (button.id === 'bookmarked') {
        allCards.forEach((card) => {
          if (card.classList.contains('notBooked')) {
            card.style.display = 'none'
          } else if (card.classList.contains('booked')) {
            card.style.display = 'flex'
          }
        })
      }
    })
  })
}

//Function for bookmarking
function toggleBookmark() {
  document.addEventListener('click', (event) => {
    const full = 'assets/icon-bookmark-full.svg'
    const empty = 'assets/icon-bookmark-empty.svg'
    const target = event.target;

    if (target.classList.contains('cardBookmark') 
      || target.classList.contains('bookmarkTcard')) {
      if (target.classList.contains('notBooked')) {
        target.classList.remove('notBooked');
        target.classList.add('booked');
        target.setAttribute('src', full);
      } else {
        target.classList.remove('booked');
        target.classList.add('notBooked');
        target.setAttribute('src', empty);
      }
    }
  })
}

//Function to save state in Json
function saveToJson() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    const card = target.closest('.card');
    const title = card.querySelector('.cardTitle').textContent.toLowerCase();

    const item = jsonData.find(function(obj) {
      return obj.title.toLowerCase() === title;
    })

    if (item) {
      if (target.classList.contains('booked')) {
          item.isBookmarked = true
          localStorage.setItem('jsonData', JSON.stringify(jsonData))
          updateUi()
      } else if (target.classList.contains('notBooked')) {
        item.isBookmarked = false
        localStorage.setItem('jsonData', JSON.stringify(jsonData))
        updateUi()
      }
    }
  })
}

//Function to render filtered results
function renderFilteredResults(filtered) {
  const allCards = document.querySelectorAll('.card, .tCard');
  allCards.forEach(card => card.style.display = 'none')

  filtered.forEach(item => {
    const matchingCard = [...allCards].find(card => {
    const cardTitle = card.querySelector('.cardTitle') || card.querySelector('.tCardTitle')
    return cardTitle && cardTitle.textContent.toLowerCase() === item.title.toLowerCase()
    })

    if (matchingCard) {
      matchingCard.style.display = 'flex'
    }
  })
}

//Function for Search Bar
function searchBarHandler() {
  const searchBar = document.getElementById('searchBarLanding');

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  })

  searchBar.addEventListener('blur', () => {
  const allCards = document.querySelectorAll('.card, .tCard');

    if (searchBar.value === '') {
      searchBar.value = ''
      allCards.forEach((card) => {
        card.style.display = 'flex'
      })
      updateUi()
    }
  })

  searchBar.addEventListener('input', () => {
    const value = searchBar.value.trim().toLowerCase();

    if (value === '') {
      updateUi()
      return;
    }

    const filteredResults = jsonData.filter(function(item) {
      return item.title.toLowerCase().includes(value);
    })
    renderFilteredResults(filteredResults)
  })
}
searchBarHandler()

