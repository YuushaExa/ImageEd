const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: 'blue',
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
        color: 'red',
        speed: 2,
        health: 50,
        attackPower: 5
    };
    enemies.push(enemy);
}

function updatePlayer() {
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
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
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
