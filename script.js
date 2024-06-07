const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 49 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box
};

let score = 0;
let d;
let speed = 200; // 初始速度较慢
let game;
let isPaused = false;

// 获取背景音乐元素
const backgroundMusic = document.getElementById('backgroundMusic');

// 按钮元素
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// 分数信息元素
const scoreMessage = document.createElement('div');
scoreMessage.style.position = 'absolute';
scoreMessage.style.top = '50%';
scoreMessage.style.left = '50%';
scoreMessage.style.transform = 'translate(-50%, -50%)';
scoreMessage.style.fontSize = '30px';
scoreMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
scoreMessage.style.padding = '20px';
scoreMessage.style.border = '2px solid #000';
scoreMessage.style.display = 'none'; // 初始隐藏
document.body.appendChild(scoreMessage);

// 事件监听器
document.addEventListener('keydown', direction);
document.addEventListener('keydown', playMusic);
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);

function playMusic() {
    backgroundMusic.play();
    document.removeEventListener('keydown', playMusic);
}

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (key == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (key == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (key == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除canvas内容

    for (let i = 0; i < snake.length; i++) {
        if (snake[i]) {
            ctx.fillStyle = (i == 0) ? 'green' : 'orange';
            ctx.beginPath();
            if (i == 0) {
                // 绘制蛇头
                ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 1.5, 0, 2 * Math.PI); // 头部半径
            } else {
                // 绘制蛇身体
                ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI); // 身体半径与食物相同
            }
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    }

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI); // 食物大小
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 49 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box
        };
        clearInterval(game);
        speed = speed > 50 ? speed - 10 : speed; // 每次吃到食物，速度增加，但速度最小为50ms
        game = setInterval(draw, speed);
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // 撞到墙时游戏结束
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        clearInterval(game);
        displayScoreMessage();
        return;
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'black';
    ctx.font = '45px Changa one';
    ctx.fillText(score, 2 * box, 1.6 * box);
}

function displayScoreMessage() {
    let message = `你的得分是 ${score}分，`;
    if (score < 10) {
        message += " 你不大行呀，哥们儿。";
    } else if (score < 20) {
        message += " 再接再厉bb。";
    } else {
        message += " 卧槽，你是最牛逼的！";
    }
    scoreMessage.innerHTML = message;
    scoreMessage.style.display = 'block';
}

function startGame() {
    if (!game) {
        game = setInterval(draw, speed);
        scoreMessage.style.display = 'none';
    } else if (isPaused) {
        game = setInterval(draw, speed);
        isPaused = false;
    }
    backgroundMusic.play();
}

function pauseGame() {
    if (game) {
        clearInterval(game);
        game = null;
        isPaused = true;
        backgroundMusic.pause();
    }
}

function restartGame() {
    clearInterval(game);
    game = null;
    isPaused = false;
    score = 0;
    speed = 200;
    d = null;
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * 49 + 1) * box,
        y: Math.floor(Math.random() * 29 + 1) * box
    };
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    scoreMessage.style.display = 'none';
    startGame();
}
