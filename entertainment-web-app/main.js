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

//Function to group variables
function getDOMElements() {
  return {
    loginScreen: document.getElementById('loginGeneralContainer'),
    signUpScreen: document.getElementById('signGeneralContainer'),
    mainContainer: document.querySelector('.mainContainer'),
    elements: document.querySelectorAll('.generalContainer, header'),
    loginButton: document.getElementById('loginButton'),
    signUpButton: document.getElementById('createAccountButton'),
    goToSignUp: document.getElementById('goToSignUp'),
    goToLogin: document.getElementById('goToLogin'),
    avatarButton: document.getElementById('avatarButton')
  };
}

//Function to show LoginScreen
function showLoginScreen(dom) {
  dom.signUpScreen.style.display = 'none'
  dom.loginScreen.style.display = 'flex'
  dom.mainContainer.style.padding = '48px 24px 115px 24px'
  dom.elements.forEach((element) => {
    element.style.display = 'none'
  })
}

//Function to show SignUp Screen
function showSignUpScreen(dom) {
  dom.signUpScreen.style.display = 'flex'
  dom.loginScreen.style.display = 'none'
  dom.mainContainer.style.padding = '48px 24px 115px 24px'
  dom.elements.forEach((element) => {
    element.style.display = 'none'
  })
}

//Function to show Main Screen
function showMainScreen (dom) {
  dom.elements.forEach((element) => {
    element.style.display = 'flex'
  });
  dom.loginScreen.style.display = 'none'
  dom.signUpScreen.style.display = 'none'
  dom.mainContainer.style.padding = '0px'
}

//Function to show Main Screen
function showMainScreen (dom) {
  dom.elements.forEach((element) => {
    if (window.innerWidth >= 1024) {
      element.style.display = 'grid'
    } else {
      element.style.display = 'flex'
    }
  });
  dom.loginScreen.style.display = 'none'
  dom.signUpScreen.style.display = 'none'
  dom.mainContainer.style.padding = '0px'
}

//Function to go back to Login Screen
function goToLoginScreen(dom) {
  dom.elements.forEach((element) => {
    element.style.display = 'none'
  });
  dom.loginScreen.style.display = 'flex'
  dom.mainContainer.style.padding = '48px 24px 115px 24px'
}

//EventListener Handler
function setupEventListeners(dom) {
  dom.goToSignUp.addEventListener('click', () => {
    showSignUpScreen(dom);
  });

  dom.goToLogin.addEventListener('click', () => {
    showLoginScreen(dom);
  });

  dom.loginButton.addEventListener('click', () => {
    showMainScreen(dom);
  });

  dom.signUpButton.addEventListener('click', () => {
    showMainScreen(dom);
  });

  dom.avatarButton.addEventListener('click', () => {
    goToLoginScreen(dom);
  });
}

//App Initializer
function initApp() {
  const dom = getDOMElements();
  setupEventListeners(dom);
  showMainScreen(dom);
}
initApp()

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
});

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
    cardYear.textContent = data.year;

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
    const card = target.closest('.card');

    if (target.classList.contains('cardBookmark') 
      || target.classList.contains('bookmarkTcard')
      || target.classList.contains('bookmark')) {

      if (card.classList.contains('notBooked')) {

        card.classList.remove('notBooked');
        card.classList.add('booked');
        target.setAttribute('src', full);
      } else {
        card.classList.remove('booked');
        card.classList.add('notBooked');
        target.setAttribute('src', empty);
      }
    }
  })
}
toggleBookmark()


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

