const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

const playerImage = new Image();
playerImage.src = 'player.png';

const enemyImage = new Image();
enemyImage.src = 'enemy.png';

const backgroundImage = new Image();
backgroundImage.src = 'https://www.spriters-resource.com/resources/sheets/152/155209.png?updated=1622984137';

const wallImage = new Image();
wallImage.src = 'https://www.spriters-resource.com/resources/sheet_icons/57/59724.png?updated=1460951654';

const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    health: 100,
    attackRange: 50,
    attackPower: 10
};

const walls = [
    { x: 0, y: 0, width: canvas.width, height: 50 }, // Top wall
    { x: 0, y: 0, width: 50, height: canvas.height } // Left wall
];

const enemies = [];
let enemySpawnTimer = 0;
const enemySpawnInterval = 2000;

function spawnEnemy() {
    const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 50,
        height: 50,
        speed: 2,
        health: 50,
        attackPower: 5
    };
    enemies.push(enemy);
}

function updatePlayer() {
    if (keys['ArrowUp'] && player.y > 50) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys['ArrowLeft'] && player.x > 50) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.x -= enemy.speed;

        if (enemy.x + enemy.width < 0) {
            enemies.splice(i, 1);
            continue;
        }

        if (Math.abs(enemy.x - player.x) <= player.attackRange && Math.abs(enemy.y - player.y) <= player.height) {
            enemy.health -= player.attackPower;
            if (enemy.health <= 0) {
                enemies.splice(i, 1);
            } else {
                player.health -= enemy.attackPower;
                if (player.health <= 0) {
                    alert('Game Over!');
                    document.location.reload();
                }
            }
        }
    }
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawWalls() {
    walls.forEach(wall => {
        ctx.drawImage(wallImage, wall.x, wall.y, wall.width, wall.height);
    });
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawWalls();
    
    updatePlayer();
    updateEnemies();
    
    drawPlayer();
    drawEnemies();

    if (timestamp > enemySpawnTimer + enemySpawnInterval) {
        spawnEnemy();
        enemySpawnTimer = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
