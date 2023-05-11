import Binding from './binding.js'

let winterIsComing = document.querySelector('#winter-is-coming'),
    buildingsTotalEl = document.querySelector('#buildings-total'),
    stockpileTotalEl = document.querySelector('#stockpile-total');

let totalNumbers = {
      buildings: 0,
      stockpile: 0,
      stockpileRounded: 0
}

let buildings = {
  'campfire': 0,
  'workbench': 0,
  'jetty': 0,
  'house': 0
}

export default {

  init() {

    this.updateBuildings();
    this.updateStockpile(0);

    this.bind();
  },

  bind: function() {

    new Binding({
      object: totalNumbers,
      property: 'buildings',
      element: document.getElementById('buildings-total-text')
    })
    new Binding({
      object: totalNumbers,
      property: 'stockpileRounded',
      element: document.getElementById('stockpile-total-text')
    })

  },

  updateGameDays(days) {

    var timePassed = Math.floor((days / 48) * 100);

    winterIsComing.style.width = timePassed + '%';

    if (days > 48) {
      document.getElementById('loose-game').classList.add('active');
    }

  },

  stockpileItem(el) {
    this.updateStockpile(0.5);
  },

  finishedBuilding(id) {
    buildings[id] = 1;
  },

  checkWinning() {
    if (totalNumbers.buildings >= 4 && totalNumbers.stockpile > 99) {
      document.getElementById('win-game').classList.add('active');
    }
  },

  updateBuildings() {

    let amount = 0;

    for (var building in buildings) {
      amount = amount + buildings[building];
    }

    totalNumbers.buildings = amount;

    var buildingsTotal = Math.floor((totalNumbers.buildings / 4) * 100);

    buildingsTotalEl.style.width = buildingsTotal + '%';

    this.checkWinning();

  },

  updateStockpile(amount) {
    totalNumbers.stockpile += amount;
    totalNumbers.stockpileRounded = Math.floor((totalNumbers.stockpile / 100) * 100);
    stockpileTotalEl.style.width = totalNumbers.stockpileRounded + '%';
    this.checkWinning();
  }

}