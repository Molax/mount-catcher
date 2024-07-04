// Elementos do DOM
const input = document.getElementById('inputText');
const arrow = document.getElementById('arrow');
const yellowArea = document.getElementById('yellowArea');
const dots = Array.from(document.querySelectorAll('.dot'));
const timerElement = document.getElementById('timer');
const timerBackground = document.querySelector('.timer-background');

// Variáveis globais para a animação da seta
let arrowPosition = 0;
let arrowDirection = 1;
let speedFactor = 1;
let isPaused = false;
let isMoving = false; // Adicionado para controle de movimento da seta
let timerId;
let timeLeft = 12;

// Funções de manipulação da barra amarela
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

// Função principal para mover a seta
function moveArrow() {
    const inputRect = input.getBoundingClientRect();
    const maxWidth = inputRect.width - arrow.offsetWidth;

    function frame() {
        if (!isPaused && isMoving) {
            arrowPosition += arrowDirection * speedFactor;

            // Verifica se a seta atingiu as bordas
            if (arrowPosition >= maxWidth) {
                arrowDirection = -1;  // Muda a direção para mover para a esquerda
            } else if (arrowPosition <= 0) {
                arrowDirection = 1;  // Muda a direção para mover para a direita
            }

            // Atualiza a posição da seta
            arrow.style.left = arrowPosition + 'px';
        }

        // Solicita o próximo quadro de animação
        animationFrameId = requestAnimationFrame(frame);
    }

    // Inicia o loop de animação
    requestAnimationFrame(frame);
}

// Função para aumentar a velocidade da seta
function increaseSpeed(factor) {
    speedFactor *= factor;
}

function resetSpeed() {
    speedFactor = 1;
}

// Função para pausar a animação por um segundo
function pauseForOneSecond() {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, 700);
}

function isAligned(arrowRect, yellowRect) {
    const arrowTipCenterX = arrowRect.left + arrowRect.width / 2;
    const margin = 1; // Define a margem de 1 pixel

    // Verifica se o centro da ponta da seta está dentro da margem de erro
    if (arrowTipCenterX >= yellowRect.left - margin && arrowTipCenterX <= yellowRect.right + margin) {
        return true;
    } else {
        return false;
    }
}

// Função para mover a área amarela para uma posição aleatória com margem nos extremos
function moveYellowArea() {
    const inputRect = input.getBoundingClientRect();
    const maxWidth = inputRect.width - yellowArea.offsetWidth;
    const margin = 17;

    const newX = Math.random() * (maxWidth - 2 * margin) + margin;

    yellowArea.style.left = newX + 'px';

    diminuiTamanhoDaBarra();
}

// Função para lidar com o clique no botão de iniciar
function handleStartButtonClick() {
    if (!isMoving) {
        isMoving = true;
        moveArrow(); // Reinicia a animação

        // Reinicia o temporizador
        timeLeft = 12;
        timerElement.textContent = timeLeft;
        timerElement.style.width = '100%'; // Resetando a largura do temporizador para 100%
        timerElement.style.backgroundColor = '#000'; // Resetando a cor de fundo para preto completo

        timerId = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            // Ajusta dinamicamente a largura do temporizador conforme o tempo restante
            timerElement.style.width = `calc(${(timeLeft / 12) * 90}% - 4px)`; // Ajuste na largura
            timerElement.style.backgroundColor = `rgb(${255 - (timeLeft * 21)}, ${255 - (timeLeft * 21)}, ${255 - (timeLeft * 21)})`; // Ajuste na cor de fundo

            if (timeLeft <= 0) {
                clearInterval(timerId);
                handleResetButtonClick();
            }
        }, 1000);
    }
}

// Função para lidar com o clique no botão de resetar
function handleResetButtonClick() {
    // Esvazia as bolinhas
    dots.forEach(dot => dot.classList.remove('active'));

    // Reseta a posição da seta e para a animação
    isMoving = false;
    cancelAnimationFrame(animationFrameId);
    arrowPosition = 0;
    arrowDirection = 1;
    arrow.style.left = arrowPosition + 'px';

    // Reseta a barra amarela
    resetaTamanhoDaBarra();
    moveYellowArea();

    // Reseta a velocidade
    resetSpeed();

    // Reseta o temporizador
    clearInterval(timerId);
    timeLeft = 12;
    timerElement.textContent = timeLeft;
    timerElement.style.width = '100%'; // Resetando a largura do temporizador para 100%
}


// Função para lidar com o evento de pressionar tecla
function handleKeyDown(event) {
    if (event.key === ' ') { // Verifica se a tecla pressionada é o espaço
        const arrowRect = arrow.getBoundingClientRect();
        const yellowRect = yellowArea.getBoundingClientRect();

        if (isAligned(arrowRect, yellowRect)) {
            increaseSpeed(1.1);
            moveYellowArea();
            arrowPosition = 0;
            arrowDirection = 1;

            const nextDot = dots.find(dot => !dot.classList.contains('active'));
            if (nextDot) {
                nextDot.classList.add('active');
            }

            // Reinicia o temporizador e seu fundo imediatamente
            timeLeft = 12;
            timerElement.textContent = timeLeft;
            timerElement.style.width = '100%'; // Resetando a largura do temporizador para 100%
            timerElement.style.backgroundColor = '#000'; // Resetando o fundo para preto completo
            clearInterval(timerId); // Para o temporizador atual, se estiver em execução
            timerId = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;

                // Ajusta dinamicamente a largura do temporizador conforme o tempo restante
                timerElement.style.width = `calc(${(timeLeft / 12) * 90}% - 4px)`; // Ajuste na largura
                timerElement.style.backgroundColor = `rgb(${255 - (timeLeft * 21)}, ${255 - (timeLeft * 21)}, ${255 - (timeLeft * 21)})`; // Ajuste na cor de fundo

                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    handleResetButtonClick();
                }
            }, 1000);
        } else {
            pauseForOneSecond();
            arrowPosition = 0;
            arrowDirection = 1;
        }
    }
}

// Função para lidar com o evento de toque na tela
function handleTouchStart(event) {
    event.preventDefault(); // Evita o comportamento padrão do toque (como zoom)

    const arrowRect = arrow.getBoundingClientRect();
    const yellowRect = yellowArea.getBoundingClientRect();

    if (isAligned(arrowRect, yellowRect)) {
        increaseSpeed(1.1);
        moveYellowArea();
        arrowPosition = 0;
        arrowDirection = 1;
    } else {
        pauseForOneSecond();
        arrowPosition = 0;
        arrowDirection = 1;
    }
}

// Adiciona listeners de eventos
function addEventListeners() {
    const startButton = document.getElementById('btnstart');
    const resetButton = document.getElementById('btnreset');

    startButton.addEventListener('click', handleStartButtonClick);
    resetButton.addEventListener('click', handleResetButtonClick);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);
}

// Inicia a animação da seta e adiciona os listeners de eventos
function initialize() {
    addEventListeners();

    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Chama a função de inicialização ao carregar a página
initialize();