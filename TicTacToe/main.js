//Variables Globales
let playerOneSelection = false;
let playerOneMark = '';
let playerTwoMark = '';
let currentPlayer = null;

//Funcion para mover el boton de seleccion de Mark
function toggleButton() {
    let toggleButtons = document.querySelectorAll('#toggleShape, #xUnselected, #oUnselected');
    let xShapeUnselected = document.getElementById('xUnselected');
    let xShapeSelected = document.getElementById('xSelected');
    let oShapeUnselected = document.getElementById('oUnselected');
    let oShapeSelected = document.getElementById('oSelected');

    toggleButtons.forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        if (!toggleButton.classList.contains('active')) {//Esta a la derecha
            toggleButton.classList.add('active');
            xShapeSelected.style.display = 'block';
            xShapeUnselected.style.display = 'none';
            oShapeSelected.style.display = 'none';
            oShapeUnselected.style.display = 'block';
            playerOneSelection = true;
            currentPlayer = 2;
        }else {
            toggleButton.classList.remove('active');//Esta a la izquierda
            xShapeSelected.style.display = 'none';
            xShapeUnselected.style.display = 'block';
            oShapeSelected.style.display = 'block';
            oShapeUnselected.style.display = 'none';
            playerOneSelection = false;
            currentPlayer = 1;
        }
        console.log('Jugador Escogió:', playerOneSelection ? 'X' : 'O');
    })
    })
}
toggleButton();

//Funcion para iniciar el Juego en VS PLAYER
function vsPlayer() {
    let newGameButton = document.getElementById('newGameCPUButton');
    
    newGameButton.addEventListener('click', function() {
        if (playerOneSelection === true) { //Si jugador 1 eligio X
            playerOneMark = 'X';
            playerTwoMark = 'O';
        }else {
            playerOneMark = 'O';
            playerTwoMark = 'X';
        }

        localStorage.setItem('playerOneSelection', playerOneSelection);
        localStorage.setItem('playerOneMark', playerOneMark);
        localStorage.setItem('playerTwoMark', playerTwoMark);
        window.location.href = 'gameScreen.html';
    })
}
vsPlayer();


