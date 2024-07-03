document.addEventListener('DOMContentLoaded', (event) => {
    let gold = 0;
    let goldPerSecond = 1;
    let upgradeCost = 10;

    const goldDisplay = document.getElementById('gold');
    const upgradeButton = document.getElementById('upgrade');
    const upgradeCostDisplay = document.getElementById('upgrade-cost');

    // Function to update the displayed gold amount
    function updateGoldDisplay() {
        goldDisplay.textContent = gold.toFixed(2);
    }

    // Function to update the upgrade button state and cost
    function updateUpgradeButton() {
        upgradeCostDisplay.textContent = upgradeCost.toFixed(2);
        upgradeButton.disabled = gold < upgradeCost;
    }

    // Function to increment gold over time
    function earnGold() {
        gold += goldPerSecond;
        updateGoldDisplay();
        updateUpgradeButton();
    }

    // Upgrade button click handler
    upgradeButton.addEventListener('click', () => {
        if (gold >= upgradeCost) {
            gold -= upgradeCost;
            goldPerSecond *= 2;
            upgradeCost *= 2;
            updateGoldDisplay();
            updateUpgradeButton();
        }
    });

    // Start the gold earning loop
    setInterval(earnGold, 1000);

    // Initial display update
    updateGoldDisplay();
    updateUpgradeButton();
});
