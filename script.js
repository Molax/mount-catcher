// Elementos do DOM
const input = document.getElementById('inputText');
const arrow = document.getElementById('arrow');
const yellowArea = document.getElementById('yellowArea');
const dots = Array.from(document.querySelectorAll('.dot'));
const timerElement = document.getElementById('timer');
const timerText = document.getElementById('timerText');
const victoryMessage = document.getElementById('victoryMessage');
const failureMessage = document.getElementById('failureMessage');

// Variáveis globais para a animação da seta
let arrowPosition = 0;
let arrowDirection = 1;
let speedFactor = 1;
let isPaused = false;
let isMoving = false;
let timerId;
let timeLeft = 10;
let timerPerMonster = 10;

function diminuiTamanhoDaBarra() {
    const div = document.getElementById('yellowArea');
    let larguraAtual = div.offsetWidth;

    if (larguraAtual >= 3) {
        div.style.width = (larguraAtual - 1) + 'px';
    }
}

function resetaTamanhoDaBarra() {
    document.getElementById('yellowArea').style.width = "10px";
}

function moveArrow() {
    const inputRect = input.getBoundingClientRect();
    const maxWidth = inputRect.width - arrow.offsetWidth;

    function frame() {
        if (!isPaused && isMoving) {
            arrowPosition += arrowDirection * speedFactor;

            if (arrowPosition >= maxWidth) {
                arrowDirection = -1;
            } else if (arrowPosition <= 0) {
                arrowDirection = 1;
            }

            arrow.style.left = arrowPosition + 'px';
        }

        animationFrameId = requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

function increaseSpeed(factor) {
    speedFactor *= factor;
}

function resetSpeed() {
    speedFactor = 1;
}

function pauseForOneSecond() {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, 700);
}

function isAligned(arrowRect, yellowRect) {
    const arrowTipCenterX = arrowRect.left + arrowRect.width / 2;
    const margin = 1;

    return arrowTipCenterX >= yellowRect.left - margin && arrowTipCenterX <= yellowRect.right + margin;
}

function moveYellowArea() {
    const inputRect = input.getBoundingClientRect();
    const maxWidth = inputRect.width - yellowArea.offsetWidth;
    const margin = 17;

    const newX = Math.random() * (maxWidth - 2 * margin) + margin;
    yellowArea.style.left = newX + 'px';

    diminuiTamanhoDaBarra();
}

function handleStartButtonClick() {
    if (!isMoving) {
        isMoving = true;
        moveArrow();

        timeLeft = timerPerMonster;
        timerElement.textContent = timeLeft;
        timerElement.style.width = '100%';
        updateTimerText();
        clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            timerElement.style.width = `calc(${(timeLeft / 10) * 100}% - 8px)`;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                handleFailure();
            } else {
                updateTimerText();
            }
        }, 1000);
    }
}

function handleResetButtonClick() {
    Array.from(document.querySelectorAll('.dot')).forEach(dot => dot.classList.remove('active'));

    isMoving = false;
    cancelAnimationFrame(animationFrameId);
    arrowPosition = 0;
    arrowDirection = 1;
    arrow.style.left = arrowPosition + 'px';

    resetaTamanhoDaBarra();
    moveYellowArea();

    resetSpeed();

    clearInterval(timerId);
    timeLeft = timerPerMonster;
    timerElement.textContent = timeLeft;
    timerElement.style.width = '100%';
    updateTimerText();
}

function handleKeyDown(event) {
    if (event.key === ' ') {
        const arrowRect = arrow.getBoundingClientRect();
        const yellowRect = yellowArea.getBoundingClientRect();

        if (isAligned(arrowRect, yellowRect)) {
            increaseSpeed(1.1);
            moveYellowArea();
            arrowPosition = 0;
            arrowDirection = 1;

            let updatedDots = Array.from(document.querySelectorAll('.dot'));

            const nextDot = updatedDots.slice().reverse().find(dot => !dot.classList.contains('active'));
            if (nextDot) {
                nextDot.classList.add('active');
            }

            if (updatedDots.every(dot => dot.classList.contains('active'))) {
                handleVictory();
            }

            timeLeft = timerPerMonster;
            timerElement.textContent = timeLeft;
            timerElement.style.width = '100%';
            updateTimerText();
            clearInterval(timerId);
            timerId = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;

                timerElement.style.width = `calc(${(timeLeft / timerPerMonster) * 100}% - 8px)`;

                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    handleFailure();
                } else {
                    updateTimerText();
                }
            }, 1000);
        } else {
            pauseForOneSecond();
            arrowPosition = 0;
            arrowDirection = 1;
        }
    }
}

function updateTimerText() {
    timerText.textContent = `${timeLeft}s`;
}

function handleTouchStart(event) {
    event.preventDefault();

    const arrowRect = arrow.getBoundingClientRect();
    const yellowRect = yellowArea.getBoundingClientRect();

    if (isAligned(arrowRect, yellowRect)) {
        increaseSpeed(1.1);
        moveYellowArea();
        arrowPosition = 0;
        arrowDirection = 1;

        let updatedDots = Array.from(document.querySelectorAll('.dot'));

        const nextDot = updatedDots.slice().reverse().find(dot => !dot.classList.contains('active'));
        if (nextDot) {
            nextDot.classList.add('active');
        }

        if (updatedDots.every(dot => dot.classList.contains('active'))) {
            handleVictory();
        }

        timeLeft = timerPerMonster;
        timerElement.textContent = timeLeft;
        timerElement.style.width = '100%';
        updateTimerText();
        clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            timerElement.style.width = `calc(${(timeLeft / timerPerMonster) * 100}% - 8px)`;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                handleFailure();
            } else {
                updateTimerText();
            }
        }, 1000);
    } else {
        pauseForOneSecond();
        arrowPosition = 0;
        arrowDirection = 1;
    }
}

function handleVictory() {

    setTimeout(() => {
        handleResetButtonClick(); // Resetar o jogo completamente
    }, 500);


    // Exibir mensagem de vitória
    victoryMessage.style.display = 'block';

    // Esconder mensagem de vitória após 2 segundos
    setTimeout(() => {
        victoryMessage.style.display = 'none';
    }, 3500);
}

function handleFailure() {
    setTimeout(() => {
        handleResetButtonClick(); // Resetar o jogo completamente
    }, 500);

    // Exibir mensagem de falha
    failureMessage.style.display = 'block';

    // Esconder mensagem de falha após 2 segundos
    setTimeout(() => {
        failureMessage.style.display = 'none';
    }, 3500);
}

// Função para atualizar as configurações do jogo com base na imagem selecionada
function updateGameSettings(newTime, newDotsCount,imagePath) {

    const buttonImage = document.querySelector('.button-image');
    buttonImage.src = imagePath; // Atualiza a imagem de fundo do botão
    // Atualiza o tempo do temporizador
    timerPerMonster = newTime;
    timeLeft = newTime;
    timerElement.textContent = timeLeft;
    timerElement.style.width = '100%'; // Resetando a largura do temporizador para 100%
    updateTimerText(); // Atualiza o texto do temporizador

    // Atualiza a quantidade de bolinhas
    resetDots(newDotsCount);

    handleResetButtonClick();
}

// Função para resetar a quantidade de bolinhas com base na imagem selecionada
function resetDots(count) {
    const dotsContainer = document.querySelector('.dots');
    
    // Remove todas as bolinhas existentes
    while (dotsContainer.firstChild) {
        dotsContainer.removeChild(dotsContainer.firstChild);
    }

    // Adiciona a quantidade correta de bolinhas
    for (let i = 1; i <= count; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.id = `dot${i}`;
        dotsContainer.appendChild(dot);
    }
}

function addEventListeners() {
    const startButton = document.getElementById('btnstart');
    const resetButton = document.getElementById('btnreset');
    const imageOptions = Array.from(document.querySelectorAll('.image-option'));

    startButton.addEventListener('click', handleStartButtonClick);
    resetButton.addEventListener('click', handleResetButtonClick);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    // Event listener para seleção de imagens
    imageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const time = parseInt(option.getAttribute('data-time'), 10);
            const dotsCount = parseInt(option.getAttribute('data-dots'), 10);
            const imagePath = option.getAttribute('data-img');
            // Atualiza o temporizador e a quantidade de bolinhas
            updateGameSettings(time, dotsCount ,imagePath);
        });
    });


}

function initialize() {
    addEventListeners();

    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

initialize();