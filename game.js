const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 80;
const PLANT_COST = 100;
let sunPoints = 500;
let gameOver = false;

class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Plant extends GameObject {
    constructor(x, y) {
        super(x, y, CELL_SIZE, CELL_SIZE);
        this.health = 100;
    }
    
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Zombie extends GameObject {
    constructor(x, y) {
        super(x, y, CELL_SIZE, CELL_SIZE);
        this.health = 50;
        this.speed = 0.5;
    }
    
    update() {
        this.x -= this.speed;
    }
    
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const plants = [];
const zombies = [];

function spawnZombie() {
    const lane = Math.floor(Math.random() * 5);
    zombies.push(new Zombie(canvas.width, lane * CELL_SIZE));
}

function handleCollisions() {
    for (let i = 0; i < zombies.length; i++) {
        for (let j = 0; j < plants.length; j++) {
            if (zombies[i].x < plants[j].x + plants[j].width &&
                zombies[i].x + zombies[i].width > plants[j].x &&
                zombies[i].y < plants[j].y + plants[j].height &&
                zombies[i].y + zombies[i].height > plants[j].y) {
                    zombies[i].health -= 1;
                    plants[j].health -= 1;

                    if (plants[j].health <= 0) {
                        plants.splice(j, 1);
                        j--;
                    }

                    if (zombies[i].health <= 0) {
                        zombies.splice(i, 1);
                        i--;
                        break;
                    }
            }
        }
    }
}

function update() {
    if (gameOver) return;

    zombies.forEach(zombie => zombie.update());
    handleCollisions();
    
    if (zombies.some(zombie => zombie.x <= 0)) {
        gameOver = true;
        alert('Game Over!');
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    plants.forEach(plant => plant.draw());
    zombies.forEach(zombie => zombie.draw());

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Sun Points: ${sunPoints}`, 10, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (sunPoints >= PLANT_COST && !plants.some(plant => plant.x === col * CELL_SIZE && plant.y === row * CELL_SIZE)) {
        plants.push(new Plant(col * CELL_SIZE, row * CELL_SIZE));
        sunPoints -= PLANT_COST;
    }
});

setInterval(spawnZombie, 2000);
gameLoop();
