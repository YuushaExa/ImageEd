const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
    allies: [],
    enemies: [],
    resources: 100,
    gameLoop: null,
    playerBase: { x: 50, y: canvas.height / 2 - 50, width: 50, height: 100, health: 200 },
    enemyBase: { x: canvas.width - 100, y: canvas.height / 2 - 50, width: 50, height: 100, health: 200 },
    gameOver: false,
    winner: null,
    autoPlacement: false,
    damageTexts: []
};

class Unit {
    constructor(x, y, type, isAlly) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isAlly = isAlly;
        const types = this.isAlly ? Ally.types : Enemy.types;
        this.health = types[type].health;
        this.maxHealth = types[type].health;
        this.attack = types[type].attack;
        this.speed = types[type].speed;
        this.attackRange = types[type].attackRange;
        this.lastAttack = 0;
        this.target = null;
        this.color = types[type].color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 15, this.y - 25, 30, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 15, this.y - 25, (this.health / this.maxHealth) * 30, 5);
    }

    move() {
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > this.attackRange) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        } else {
            const baseX = this.isAlly ? game.enemyBase.x : game.playerBase.x;
            const baseY = this.isAlly ? game.enemyBase.y + game.enemyBase.height / 2 : game.playerBase.y + game.playerBase.height / 2;
            const dx = baseX - this.x;
            const dy = baseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    findTarget() {
        const targets = this.isAlly ? game.enemies : game.allies;
        let closestTarget = null;
        let closestDistance = Infinity;
        for (const target of targets) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        }
        this.target = closestTarget;
    }

    attack() {
        if (this.target && Date.now() - this.lastAttack > 1000) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.attackRange) {
                const damage = this.attack;
                this.target.health -= damage;
                this.lastAttack = Date.now();
                
                // Add damage text
                game.damageTexts.push({
                    x: this.target.x,
                    y: this.target.y,
                    value: damage,
                    timer: 30
                });

                if (this.target.health <= 0) {
                    this.target = null;
                }
            }
        }
    }

    update() {
        if (!this.target) this.findTarget();
        this.move();
        this.attack();
    }
}

class Ally extends Unit {
    constructor(x, y, type) {
        super(x, y, type, true);
    }

    static types = {
        fighter: { health: 100, attack: 20, speed: 1, attackRange: 50, cost: 50, color: 'blue' },
        tank: { health: 200, attack: 10, speed: 0.5, attackRange: 30, cost: 100, color: 'darkgreen' },
        ranger: { health: 80, attack: 15, speed: 1.2, attackRange: 100, cost: 75, color: 'purple' }
    };
}

class Enemy extends Unit {
    constructor(x, y, type) {
        super(x, y, type, false);
    }

    static types = {
        grunt: { health: 80, attack: 10, speed: 0.8, attackRange: 40, color: 'red' },
        brute: { health: 150, attack: 20, speed: 0.6, attackRange: 30, color: 'darkred' },
        scout: { health: 60, attack: 8, speed: 1.5, attackRange: 60, color: 'orange' }
    };
}

function toggleAutoPlacement() {
    game.autoPlacement = !game.autoPlacement;
    document.getElementById('autoPlacementBtn').textContent = game.autoPlacement ? 'Disable Auto Placement' : 'Enable Auto Placement';
}

function autoPlaceAlly() {
    if (!game.autoPlacement || game.gameOver) return;
    const types = Object.keys(Ally.types);
    const type = types[Math.floor(Math.random() * types.length)];
    if (game.resources >= Ally.types[type].cost) {
        const x = Math.random() * (canvas.width / 4) + 50;
        const y = Math.random() * canvas.height;
        game.allies.push(new Ally(x, y, type));
        game.resources -= Ally.types[type].cost;
    }
}

setInterval(autoPlaceAlly, 2000);

canvas.addEventListener('click', (event) => {
    if (game.gameOver || game.autoPlacement) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const type = document.querySelector('input[name="allyType"]:checked').value;
    if (game.resources >= Ally.types[type].cost) {
        game.allies.push(new Ally(x, y, type));
        game.resources -= Ally.types[type].cost;
    }
});

setInterval(() => {
    if (game.gameOver) return;
    const enemyTypes = Object.keys(Enemy.types);
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    game.enemies.push(new Enemy(game.enemyBase.x, Math.random() * canvas.height, randomType));
}, 5000);

function drawBase(base, color) {
    ctx.fillStyle = color;
    ctx.fillRect(base.x, base.y, base.width, base.height);
    
    ctx.fillStyle = 'red';
 ctx.fillRect(base.x, base.y - 10, base.width, 5);
    ctx.fillStyle = 'green';
    ctx.fillRect(base.x, base.y - 10, (base.health / 200) * base.width, 5);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBase(game.playerBase, 'purple');
    drawBase(game.enemyBase, 'black');

    game.allies = game.allies.filter(ally => ally.health > 0);
    game.allies.forEach(ally => {
        ally.update();
        ally.draw();
    });

    game.enemies = game.enemies.filter(enemy => enemy.health > 0);
    game.enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });

    // Draw damage texts
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    game.damageTexts = game.damageTexts.filter(text => text.timer > 0);
    game.damageTexts.forEach(text => {
        ctx.fillText(text.value, text.x, text.y);
        text.y -= 1;
        text.timer--;
    });

    // Check if any unit has reached the enemy base
    game.allies.forEach(ally => {
        const dx = game.enemyBase.x - ally.x;
        const dy = (game.enemyBase.y + game.enemyBase.height / 2) - ally.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ally.attackRange) {
            game.enemyBase.health -= ally.attack / 10;
            if (game.enemyBase.health <= 0) {
                game.gameOver = true;
                game.winner = 'Allies';
            }
        }
    });

    // Check if any enemy has reached the player base
    game.enemies.forEach(enemy => {
        const dx = game.playerBase.x - enemy.x;
        const dy = (game.playerBase.y + game.playerBase.height / 2) - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.attackRange) {
            game.playerBase.health -= enemy.attack / 10;
            if (game.playerBase.health <= 0) {
                game.gameOver = true;
                game.winner = 'Enemies';
            }
        }
    });

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Resources: ${Math.floor(game.resources)}`, 10, 30);

    if (game.gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText(`Game Over! ${game.winner} win!`, canvas.width / 2 - 150, canvas.height / 2);
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// Generate resources over time
setInterval(() => {
    if (!game.gameOver) {
        game.resources += 10;
    }
}, 1000);

// Start the game
gameLoop();
