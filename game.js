const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

const playerImage = new Image();
playerImage.src = 'path/to/your/player.png';

const enemyImage = new Image();
enemyImage.src = 'path/to/your/enemy.png';

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
    enemies.forEach(enemy => {
        if (enemy.x > player.x) {
            enemy.x -= enemy.speed;
        }
        if (enemy.x < player.x) {
            enemy.x += enemy.speed;
        }
        if (enemy.y > player.y) {
            enemy.y -= enemy.speed;
        }
        if (enemy.y < player.y) {
            enemy.y += enemy.speed;
        }

        if (Math.abs(enemy.x - player.x) <= player.attackRange && Math.abs(enemy.y - player.y) <= player.height) {
            enemy.health -= player.attackPower;
            if (enemy.health <= 0) {
                enemies.splice(enemies.indexOf(enemy), 1);
            } else {
                player.health -= enemy.attackPower;
                if (player.health <= 0) {
                    alert('Game Over!');
                    document.location.reload();
                }
            }
        }
    });
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBoundaries() {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;

    // Top boundary
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(canvas.width, 50);
    ctx.stroke();

    // Left boundary
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, canvas.height);
    ctx.stroke();
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoundaries();
    
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
