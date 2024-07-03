document.addEventListener('DOMContentLoaded', (event) => {
    let gold = 10000;
    let units = {
        warrior: { quantity: 0, gps: 1, cost: 10, color: 'blue' },
        archer: { quantity: 0, gps: 5, cost: 50, color: 'green' }
    };
    let level = 1;

    const goldDisplay = document.getElementById('gold');
    const unitElements = {
        warrior: {
            quantity: document.getElementById('warrior-quantity'),
            gps: document.getElementById('warrior-gps'),
            cost: document.getElementById('warrior-cost')
        },
        archer: {
            quantity: document.getElementById('archer-quantity'),
            gps: document.getElementById('archer-gps'),
            cost: document.getElementById('archer-cost')
        }
    };
    const battleButton = document.getElementById('battle');
    const levelDisplay = document.getElementById('level');
    const canvas = document.getElementById('battlefield');
    const ctx = canvas.getContext('2d');

    function updateGoldDisplay() {
        goldDisplay.textContent = gold.toFixed(2);
    }

    function updateUnitDisplay(unit) {
        unitElements[unit].quantity.textContent = units[unit].quantity;
        unitElements[unit].gps.textContent = units[unit].gps;
        unitElements[unit].cost.textContent = units[unit].cost.toFixed(2);
    }

    function updateAllUnitsDisplay() {
        for (let unit in units) {
            updateUnitDisplay(unit);
        }
    }

    function earnGold() {
        let totalGps = 0;
        for (let unit in units) {
            totalGps += units[unit].quantity * units[unit].gps;
        }
        gold += totalGps;
        updateGoldDisplay();
    }

    function renderBattlefield() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw units
        let xOffset = 50;
        for (let unit in units) {
            for (let i = 0; i < units[unit].quantity; i++) {
                ctx.fillStyle = units[unit].color;
                ctx.fillRect(xOffset, canvas.height - 50, 20, 20);
                xOffset += 30;
            }
        }

        // Draw enemies
        let enemyCount = level * 10;
        for (let i = 0; i < enemyCount; i++) {
            ctx.fillStyle = 'red';
            ctx.fillRect(canvas.width - xOffset, canvas.height - 50, 20, 20);
            xOffset += 30;
        }

        // Draw crystal
        ctx.fillStyle = 'purple';
        ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2 - 10, 20, 20);
    }

    document.querySelectorAll('.buy-unit').forEach(button => {
        button.addEventListener('click', () => {
            const unit = button.getAttribute('data-unit');
            if (gold >= units[unit].cost) {
                gold -= units[unit].cost;
                units[unit].quantity++;
                units[unit].cost *= 1.5;
                updateGoldDisplay();
                updateUnitDisplay(unit);
                renderBattlefield();
            }
        });
    });

    battleButton.addEventListener('click', () => {
        let battleStrength = 0;
        for (let unit in units) {
            battleStrength += units[unit].quantity;
        }

        if (battleStrength >= level * 10) {
            level++;
            levelDisplay.textContent = level;
            gold += level * 100;
            updateGoldDisplay();
            renderBattlefield();
        } else {
            alert("You need more units to win this battle!");
        }
    });

    setInterval(earnGold, 1000);

    updateGoldDisplay();
    updateAllUnitsDisplay();
    renderBattlefield();
});
