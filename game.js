const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const keys = {};
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    hp: 100,
    attack: 10,
    img: new Image(),
    color: 'red'
};
player.img.src = 'player.png'; // Replace with your player image path

const enemy = {
    x: canvas.width - 200,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 3,
    dx: 0,
    dy: 0,
    hp: 100,
    attack: 5,
    img: new Image(),
    color: 'blue'
};
enemy.img.src = 'enemy.png'; // Replace with your enemy image path

const backgrounds = [
    { src: 'background1.png', x: 0, speed: 0.2 },
    { src: 'background2.png', x: 0, speed: 0.4 },
    { src: 'background3.png', x: 0, speed: 0.6 }
];

backgrounds.forEach(bg => {
    const img = new Image();
    img.src = bg.src;
    bg.img = img;
});

function drawBackground() {
    backgrounds.forEach(bg => {
        ctx.drawImage(bg.img, bg.x, 0, canvas.width, canvas.height);
        ctx.drawImage(bg.img, bg.x + canvas.width, 0, canvas.width, canvas.height);
    });
}

function moveBackground() {
    backgrounds.forEach(bg => {
        bg.x -= player.dx * bg.speed;
        if (bg.x <= -canvas.width) bg.x = 0;
    });
}

function drawCharacter(character) {
    ctx.drawImage(character.img, character.x, character.y, character.width, character.height);
}

function drawHP(character, x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 100, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, character.hp, 10);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos(character) {
    character.x += character.dx;
    character.y += character.dy;

    if (character.x < 0) character.x = 0;
    if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
}

function collisionDetection() {
    if (player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
        // Collision detected
        console.log('Collision detected!');
    }
}

function attack() {
    if (Math.abs(player.x - enemy.x) < 50 && Math.abs(player.y - enemy.y) < 50) {
        enemy.hp -= player.attack;
        console.log('Enemy HP: ' + enemy.hp);
        if (enemy.hp <= 0) {
            console.log('Enemy defeated!');
            enemy.x = -enemy.width; // Move enemy off-screen
        }
    }
}

function update() {
    clear();
    moveBackground();
    drawBackground();
    newPos(player);
    drawCharacter(player);
    drawHP(player, 10, 10);
    newPos(enemy);
    drawCharacter(enemy);
    drawHP(enemy, canvas.width - 110, 10);
    collisionDetection();

    requestAnimationFrame(update);
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function keyDown(e) {
    keys[e.key] = true;

    if (keys['ArrowRight'] || keys['d']) {
        moveRight();
    }

    if (keys['ArrowLeft'] || keys['a']) {
        moveLeft();
    }
}

function keyUp(e) {
    keys[e.key] = false;

    if (!keys['ArrowRight'] && !keys['d'] && !keys['ArrowLeft'] && !keys['a']) {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

document.getElementById('attackButton').addEventListener('click', attack);

update();
