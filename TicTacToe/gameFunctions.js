// Recuperar datos de localStorage al cargar la página
window.addEventListener('load', function () {
    let clickCount = 0;
    let clicksPorCuadrante = {};
    let turnNumber = 1;
    let currentPlayer = null;
    let currentMarkPermitted = 'O';
    let permittedO = null;
    let permittedX = null;

    let wayToWin = {};
    const winningCombinations = [
        ["one", "two", "three"], // Fila superior
        ["four", "five", "six"], // Fila del medio
        ["seven", "eight", "nine"], // Fila inferior
        ["one", "four", "seven"], // Columna izquierda
        ["two", "five", "eight"], // Columna central
        ["three", "six", "nine"], // Columna derecha
        ["one", "five", "nine"], // Diagonal principal
        ["three", "five", "seven"] // Diagonal secundaria
    ];
    let winnerFound = false;
    

    const playerOneSelection = localStorage.getItem('playerOneSelection') === 'true'; // Convertir a booleano
    const playerOneMark = localStorage.getItem('playerOneMark');
    const playerTwoMark = localStorage.getItem('playerTwoMark');

//Funcion para designar Current Player
function designateCurrentPlayer() {

    if (playerOneSelection === false && clickCount <= 1 && turnNumber <= 1) { //Primer Turno, Si al iniciar P1 eligio O
        currentPlayer = 1;
        permittedO = true;
        permittedX = false;
    } else if (playerOneSelection === true && clickCount <= 1 && turnNumber <= 1) { //Primer Turno, Si al iniciar el P1 eligio X
        currentPlayer = 2
        permittedO = false;
        permittedX = true;
    }

    if (permittedO === true && permittedX === false && turnNumber <= 1) { //Jugador 1 eligio O
        currentMarkPermitted = 'O';
    } else if (permittedO === false && permittedX === true && turnNumber <= 1) {
        currentMarkPermitted = 'O'
    } else if (permittedO === false && permittedX === true && turnNumber >= 2) {
        currentMarkPermitted = 'X'
    }
}
designateCurrentPlayer();

//Funcion para mostrar simbolos en cada cuadrante
function handleClicksAndTurns() {
    let cuadrantes = document.querySelectorAll('.cuadranteContainer');

    cuadrantes.forEach(function(cuadrante) {
        const id = cuadrante.id;
        let imageO = cuadrante.querySelector('.cuadranteO');
        let imageX = cuadrante.querySelector('.cuadranteX');
        let showTurnO = document.getElementById('turnO');
        let showTurnX = document.getElementById('turnX');

        cuadrante.addEventListener('click', function() {

            if (winnerFound === true) {
                console.log('Game already finished, please start a new game or a new round');
                return;
            }
            //Manejar Return en cada cuadrante cuando llega a 2 clicks
            if (!clicksPorCuadrante[id]) {
                clicksPorCuadrante[id] = 0;
            }
            clicksPorCuadrante[id]++;

            if (clicksPorCuadrante[id] >= 2) {
                return;
            }
            clickCount++;
            turnNumber ++;

            if (currentMarkPermitted === 'O') {
                imageO.style.display = 'block';
                currentMarkPermitted = 'X';
                showTurnO.style.display = 'none';
                showTurnX.style.display = 'block';
            } else if (currentMarkPermitted === 'X') {
                imageX.style.display = 'block'
                currentMarkPermitted = 'O';
                currentPlayer = 1;
                showTurnO.style.display = 'block';
                showTurnX.style.display = 'none';
            }
            
            wayToWin[id] = currentMarkPermitted;//Guarda el ID del cudrante Clickado y su Mark
            let result = checkForWinner();
            if (result) {
                console.log('Se encontro Ganador, Juego Terminado');
            }
        })
    })
}
handleClicksAndTurns();

//Funcion para pantalla de Empate
function showTiedScreen() {
    let quitButton = document.getElementById('tiedQuitButton');
    let nextRoundButton = document.getElementById('tiedNextRoundButton');
    let tiedScreen = document.querySelector('.tiedScreenContainer');
    let overlay = document.getElementById('overlay');
    let imagenesO = document.querySelectorAll('.cuadranteO');
    let imagenesX = document.querySelectorAll('.cuadranteX');
    let showTurnO = document.getElementById('turnO');
    let showTurnX = document.getElementById('turnX');


    overlay.style.display = 'flex';

    quitButton.addEventListener('click', function() {

        imagenesO.forEach(function(imageO) {
            imageO.style.display = 'none';
        });

        imagenesX.forEach(function(imageX) {
            imageX.style.display = 'none';
        })
        overlay.style.display = 'none';
        window.location.href = 'index.html';
    });

    nextRoundButton.addEventListener('click', function() {
        imagenesO.forEach(function(imageO) {
            imageO.style.display = 'none';
        });

        imagenesX.forEach(function(imageX) {
            imageX.style.display = 'none';
        })
        overlay.style.display = 'none';
        tiedScreen.style.display = 'none';
        showTurnO.style.display = 'block';
        showTurnX.style.display = 'none';
        clickCount = 0;
        clicksPorCuadrante = {};
        wayToWin = {};
        winnerFound = false;
        turnNumber = 1;
        currentMarkPermitted = 'O';
        permittedO = null;
        permittedX = null;
    })
}

//Funcion para pantalla de ganador
function showWinnerScreen() {
    let winnerScreen = document.querySelector('.winnerScreenContainer');
    let nextRoundButton = document.getElementById('nextRoundButton');
    let quitButton = document.getElementById('quitButton');
    let overlay = document.getElementById('overlay');
    let imagenesO = document.querySelectorAll('.cuadranteO');
    let imagenesX = document.querySelectorAll('.cuadranteX');
    let showTurnO = document.getElementById('turnO');
    let showTurnX = document.getElementById('turnX');
    let cuadrantes = document.querySelectorAll('.cuadranteContainer');

    //Funcion animacion de confetti
    function lanzarConfeti() {
        confetti({
            particleCount: 200, // Cantidad de partículas
            spread: 90, // Angulo de dispersión
            origin: { y: 0.6 }, // Desde dónde sale el confeti
            scalar: 1.2 // Tamaño del confeti
        });
    }

    winnerScreen.style.display = 'flex';
    overlay.style.display = 'block';
    lanzarConfeti();

    nextRoundButton.addEventListener('click', function() { //Next Round Button
        imagenesO.forEach(function(imageO) {
            imageO.style.display = 'none';
        });

        imagenesX.forEach(function(imageX) {
            imageX.style.display = 'none';
        })
        cuadrantes.forEach(function(cuadrante) {
            cuadrante.style.backgroundColor = '#1F3641';
        })
        overlay.style.display = 'none';
        winnerScreen.style.display = 'none';
        showTurnO.style.display = 'block';
        showTurnX.style.display = 'none';
        clickCount = 0;
        clicksPorCuadrante = {};
        wayToWin = {};
        winnerFound = false;
        turnNumber = 1;
        currentMarkPermitted = 'O';
        permittedO = null;
        permittedX = null;
    })

    quitButton.addEventListener('click', function() { //Next Round Button
        imagenesO.forEach(function(imageO) {
            imageO.style.display = 'none';
        });
        imagenesX.forEach(function(imageX) {
            imageX.style.display = 'none';
        })
        overlay.style.display = 'none';
        winnerScreen.style.display = 'none;'
        window.location.href = 'index.html';
    });
}

//Funcion para detectar Ganador
function checkForWinner() {
    for (let i = 0; i < winningCombinations.length; i++) {
        let combo = winningCombinations[i];
        let a = combo[0];
        let b = combo[1];
        let c = combo[2];

        if (wayToWin[a] && wayToWin[a] === wayToWin[b] && wayToWin[a] === wayToWin[c]) {
                winnerFound = true;
                showWinnerScreen();
                console.log('Se encontro Ganador!');

                combo.forEach(function(id) {
                    let cuadrante = document.getElementById(id);
                    cuadrante.style.backgroundColor = '#FFD700';
                })
            }
            if (Object.keys(wayToWin).length === 9 && winnerFound === false) {
                console.log("¡Empate! No hay más movimientos disponibles.");
                let tiedScreen = document.querySelector('.tiedScreenContainer');
                tiedScreen.style.display = 'flex';
                showTiedScreen();
            }
    }
}
    
//Funcion para cambios dinamicos segun seleccion de player 1
function playerDinamics() {
    let xScore = document.getElementById('xScore');
    let oScore = document.getElementById('oScore');
    let xResult = document.getElementById('xScoreResult');
    let oResult = document.getElementById('oScoreResult');

    if (playerOneSelection === true) {
        xScore.textContent = '(P1)'
        oScore.textContent = '(P2)'
    } else if (playerOneSelection === false) {
        xScore.textContent = '(P2)'
        oScore.textContent = '(P1)'
    }
}
playerDinamics();

//Funcion para resetButton
function resetButton() {
    let restartButton = document.querySelector('.restartButton');
    let restartScreen = document.querySelector('.restartScreenContainer');
    let overlay = document.getElementById('overlay');
    let yesButton = document.getElementById('yesButton');
    let noButton = document.getElementById('noButton');

    restartButton.addEventListener('click', function() {
        restartScreen.style.display = 'flex';
        overlay.style.display = 'block';

        noButton.addEventListener('click', function() {
            restartScreen.style.display = 'none';
            overlay.style.display = 'none';
        });

        yesButton.addEventListener('click', function() {
            let imagenesO = document.querySelectorAll('.cuadranteO');
            let imagenesX = document.querySelectorAll('.cuadranteX');
            let showTurnO = document.getElementById('turnO');
            let showTurnX = document.getElementById('turnX');

            imagenesO.forEach(function(imageO) {
                imageO.style.display = 'none';
            });

            imagenesX.forEach(function(imageX) {
                imageX.style.display = 'none';
            })
            restartScreen.style.display = 'none';
            overlay.style.display = 'none';
            window.location.href = 'index.html';
        })
    })
}
resetButton();

});





