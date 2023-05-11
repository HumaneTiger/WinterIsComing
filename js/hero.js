import Audio from './audio.js';
import Day from './day.js';
import Night from './night.js';
import Objects from './objects.js'
import Controls from './controls.js'

let currentHero = "christin";

let heroElement;

let equipmentContainer = document.querySelector("div.equipment");
let inventarContainerDay = document.querySelector("#day div.inventar");
let inventarContainerNight = document.querySelector("#night div.inventar");
let dayContentContainer = document.querySelector('#day .day__content');

let heros = ["victor", "christin"];

let equipment = {
  "victor": {
    back: "empty",
    left: "item-lighter",
    right: "empty",
    pocket: "empty"  
  },
  "christin": {
    back: "item-backbag",
    left: "empty",
    right: "empty",
    pocket: "empty"  
  }
}

let inventar = {
  "victor": {
    inv1: "empty",
    inv2: "empty",
    inv3: "empty",
    inv4: "locked",
    inv5: "locked",
    inv6: "locked"  
  },
  "christin": {
    inv1: "empty",
    inv2: "empty",
    inv3: "empty",
    inv4: "empty",
    inv5: "empty",
    inv6: "empty"  
  }
}

let collecting = {
  "victor": {
    resource: '',
    progress: 0
  },
  "christin": {
    resource: '',
    progress: 0
  }
}

let pauseActivity = {
  "victor": false,
  "christin": false
};

let crafting = {
  "victor": {
    craft: '',
    progress: 0
  },
  "christin": {
    craft: '',
    progress: 0
  }
}

export default {
  
  init() {

    heroElement = {
      "victor": dayContentContainer.querySelector(".hero-victor"),
      "christin": dayContentContainer.querySelector(".hero-christin")
    }
    
    this.updateEquipment();
    this.updateInventar();
    
  },

  hourlyTasks() {
    this.updateCollectingProgress();
    this.updateCraftingProgress();
  },

  updateEquipment() {

    equipmentContainer.querySelector('.equipment__owner').classList.remove('owner-victor');
    equipmentContainer.querySelector('.equipment__owner').classList.remove('owner-christin');

    equipmentContainer.querySelector('.equipment__owner').classList.add('owner-' + currentHero);

    equipmentContainer.querySelectorAll('.item').forEach(item => { item.remove(); });

    for (const key in equipment[currentHero]) {

      let currentItem = equipment[currentHero][key];
      let currentSlot = equipmentContainer.querySelector('.slot-' + key);

      if (currentItem !== "empty") {
        
        currentSlot.classList.remove('slot--empty');
        currentSlot.classList.add('slot--full');
    
        let itemClone = Objects.cloneDayObject(currentItem);

        itemClone.classList.add('equipment__slot');
        itemClone.classList.add('slot-' + key);

        equipmentContainer.appendChild(itemClone);  

      } else {

        currentSlot.classList.remove('slot--full');
        currentSlot.classList.add('slot--empty');

      }

    }

  },

  updateInventar() {

    this.updateInventarContainer(inventarContainerDay);
    this.updateInventarContainer(inventarContainerNight);

  },

  updateInventarContainer(inventarContainer) {

    inventarContainer.querySelectorAll('.item').forEach(item => { item.remove(); });

    for (const key in inventar[currentHero]) {

      let currentItem = inventar[currentHero][key];
      let currentSlot = inventarContainer.querySelector('.slot-' + key);

      if (currentItem === "locked") {
        currentSlot.classList.remove('slot--full');
        currentSlot.classList.remove('slot--empty');
        currentSlot.classList.add('slot--locked');
      } else if (currentItem !== "empty") {
        currentSlot.classList.remove('slot--empty');
        currentSlot.classList.add('slot--full');
    
        let itemClone = Objects.cloneDayObject(currentItem);

        itemClone.classList.add('inventar__slot');
        itemClone.classList.add('slot-' + key);

        inventarContainer.appendChild(itemClone);  

      } else {

        currentSlot.classList.remove('slot--locked');
        currentSlot.classList.remove('slot--full');
        currentSlot.classList.add('slot--empty');

      }

    }

  },

  removeElement(el) {
    
    if (el.classList.contains('equipment__slot')) {
      if (el.classList.contains('slot-left')) {
        equipment[currentHero].left = 'empty';
      } else if (el.classList.contains('slot-right')) {
        equipment[currentHero].right = 'empty';
      } else if (el.classList.contains('slot-pocket')) {
        equipment[currentHero].pocket = 'empty';
      }
      this.updateEquipment();
    }
    if (el.classList.contains('inventar__slot')) {
      if (el.classList.contains('slot-inv1')) {
        inventar[currentHero].inv1 = 'empty';
      } else if (el.classList.contains('slot-inv2')) {
        inventar[currentHero].inv2 = 'empty';
      } else if (el.classList.contains('slot-inv3')) {
        inventar[currentHero].inv3 = 'empty';
      } else if (el.classList.contains('slot-inv4')) {
        inventar[currentHero].inv4 = 'empty';
      } else if (el.classList.contains('slot-inv5')) {
        inventar[currentHero].inv5 = 'empty';
      } else if (el.classList.contains('slot-inv6')) {
        inventar[currentHero].inv6 = 'empty';
      }
      this.updateInventar();
    }
    el.remove();
  },

  setPauseActivity(heroEl, value) {
    pauseActivity[this.getHeroByEl(heroEl)] = value;
  },

  getPauseActivity(heroEl) {
    return pauseActivity[this.getHeroByEl(heroEl)];
  },

  setCurrentHero(hero) {
    if (hero !== currentHero) {
      currentHero = hero;
      this.updateEquipment();
      this.updateInventar();
    }
    let nightHero = document.querySelector('#night .hero');
    nightHero.classList.remove('hero-victor');
    nightHero.classList.remove('hero-christin');
    nightHero.classList.add('hero-' + hero);
  },

  getHeroByEl(heroEl) {
    let hero = '';
    if (heroEl.classList) {
      heroEl.classList.forEach(className => {
        if (className.startsWith('hero-')) {
          hero = className.substr(5);
        }
      });  
    } else {
      console.log('no hero id for element', heroEl);
    }
    return hero;
  },

  say(heroEl, text, size) {
    heroEl.querySelector('.bubble').classList.remove('is--hidden');
    heroEl.querySelector('.bubble .text').textContent = text;
    heroEl.querySelector('.bubble .text').classList.remove('small');
    if (size) heroEl.querySelector('.bubble .text').classList.add(size);
    window.setTimeout(() => {
      heroEl.querySelector('.bubble .text').textContent = '...';
      heroEl.querySelector('.bubble')?.classList.add('is--hidden');
    }, 4000);
  },

  startCrafting(heroEl, craftContainer) {

    let hero = this.getHeroByEl(heroEl);
    let craft = craftContainer.id;

    if (craft === 'campfire') {
      Objects.hide('hint-character-build');
      if (equipment[hero].left === 'item-lighter' || equipment[hero].right === 'item-lighter') {
        this.say(heroEl, "Alright. Let's do this!");
      } else {
        this.say(heroEl, "I need a lighter in my hand to do this!");
        Audio.sfx('nope');
        return;
      }  
    }

    if (craft === 'fishingJetty') {
      if (equipment[hero].left === 'item-saw' || equipment[hero].right === 'item-saw') {
        this.say(heroEl, "Alright. Let's do this!");
      } else {
        this.say(heroEl, "I need a saw in my hand to do this!");
        Audio.sfx('nope');
        return;
      }  
    }

    if (craft === 'workbench') {
      if (equipment[hero].left === 'item-hammer' || equipment[hero].right === 'item-hammer') {
        this.say(heroEl, "Alright. Let's do this!");
      } else {
        this.say(heroEl, "I need a hammer in my hand to do this!");
        Audio.sfx('nope');
        return;
      }  
    }

    if (craft === 'house') {
      if ((equipment[hero].left === 'item-hammer' || equipment[hero].right === 'item-hammer') &&
          (equipment[hero].left === 'item-meter' || equipment[hero].right === 'item-meter')) {
        this.say(heroEl, "Alright. Let's do this!");
      } else {
        this.say(heroEl, "I need a hammer and a folding ruler to do this!", "small");
        Audio.sfx('nope');
        return;
      }
    }

    collecting[hero].resource = '';
    crafting[hero].craft = craft;
    crafting[hero].progress = 0;
    heroElement[hero].querySelector('.activity .text').textContent = 'crafting...';
    heroElement[hero].querySelector('.progress').style.width = 0;
    heroEl.classList.add('active');

},

  updateCraftingProgress() {

    let rate = 3; // dynamic

    heros.forEach(hero => {
      if (crafting[hero].craft !== '') {
        crafting[hero].progress += rate;
        heroElement[hero].querySelector('.progress').style.width = (crafting[hero].progress - 6) + '%';
        if (crafting[hero].progress > 100) {
          this.finishCrafting(hero);
        }
      }
    });
  },

  finishCrafting(hero) {

    if (crafting[hero].craft === 'campfire') {
      this.say(heroElement[hero], "Done. What a comfy campfire we have now!", "small");
      Objects.hide('hint-branches');
      Objects.hide('hint-stones');
      Objects.hide('hint-learned-campfire');
      Objects.hide('hint-character-build');
      window.setTimeout(() => {Objects.show('hint-store-in-box');}, 2000);
    } else if (crafting[hero].craft === 'fishJetty') {
      this.say(heroElement[hero], "Done. Looking forward to some fresh fish!", "small");
    } else if (crafting[hero].craft === 'workbench') {
      this.say(heroElement[hero], "Done. Let's knock on wood!");
    } else if (crafting[hero].craft === 'house') {
      this.say(heroElement[hero], "Done. This new home brings so much hope!", "small");
    }

    Audio.sfx('craft');
    document.getElementById(crafting[hero].craft).classList.add('is--hidden');
    document.getElementById(crafting[hero].craft + '-ready').classList.remove('is--hidden');
    Controls.finishedBuilding(crafting[hero].craft);
    Controls.updateBuildings();

    crafting[hero].craft = '';
    crafting[hero].progress = 0;

    heroElement[hero].querySelector('.progress').style.width = 0;
    heroElement[hero].classList.remove('active');

  },

  startCollecting(heroEl, resource) {

    var hero = this.getHeroByEl(heroEl);

    if (resource === 'log') {
      if (equipment[hero].left === 'item-axe' || equipment[hero].right === 'item-axe') {
        this.say(heroEl, "Let's chop!");
        heroElement[hero].querySelector('.activity .text').textContent = 'chopping...';
      } else {
        this.say(heroEl, "I need an axe in my hand to do this!");
        Audio.sfx('nope');
        return;
      }
    }

    if (resource === 'rock') {
      if (equipment[hero].left === 'item-hammer' || equipment[hero].right === 'item-hammer') {
        this.say(heroEl, "Rock'n'roll!");
        heroElement[hero].querySelector('.activity .text').textContent = 'rocking...';
      } else {
        this.say(heroEl, "Need a hammer in my hand to beat this thing!", "small");
        Audio.sfx('nope');
        return;
      }
    }

    if (resource === 'fish') {
      if (equipment[hero].left === 'item-fishing' || equipment[hero].right === 'item-fishing') {
        this.say(heroEl, "Fishy, fishy, fishy!");
        heroElement[hero].querySelector('.activity .text').textContent = 'fishing...';
      } else {
        this.say(heroEl, "Can't catch 'em with my hands. I need a fishing rod!", "small");
        Audio.sfx('nope');
        return;
      }
    }

    if (resource === 'wood') {
      this.say(heroEl, "Here comes the good stuff!");
      heroElement[hero].querySelector('.activity .text').textContent = 'working...';
    }

    if (resource === 'branch' || resource === 'stones') {
      heroElement[hero].querySelector('.activity .text').textContent = 'collecting...';
    }

    crafting[hero].craft = '';
    collecting[hero].resource = resource;
    collecting[hero].progress = 0;
    heroElement[hero].querySelector('.progress').style.width = 0;

    heroEl.classList.add('active');
    this.setPauseActivity(heroEl, false);

    Objects.hide('hint-' + resource);

  },

  updateCollectingProgress() {

    let rate = 20;

    heros.forEach(hero => {
      if (collecting[hero].resource !== '' && !pauseActivity[hero]) {
        collecting[hero].progress += rate;
        heroElement[hero].querySelector('.progress').style.width = (collecting[hero].progress - 10) + '%';
        if (collecting[hero].progress > 100) {
          this.spawnResource(hero);
        }
      }
    });

  },

  spawnResource(hero) {

    let resource = collecting[hero].resource;
    let itemClone;
    let shiftX = Math.floor(Math.random() * 40) - 20;
    let shiftY = Math.floor(Math.random() * 40) - 20;

    if (resource === 'branch') {
      itemClone = Objects.cloneDayObject('item-branch', 580 + shiftX, 870 + shiftY);
      Audio.sfx('break-twig');
    } else if (resource === 'log') {
      itemClone = Objects.cloneDayObject('item-log', 600 + shiftX, 440 + shiftY);
      Audio.sfx('chop-wood');
    } else if (resource === 'stones') {
      itemClone = Objects.cloneDayObject('item-stones', 1200 + shiftX, 600 + shiftY);
      Audio.sfx('collect-stones');
    } else if (resource === 'rock') {
      itemClone = Objects.cloneDayObject('item-rock', 1350 + shiftX, 330 + shiftY);
      Audio.sfx('chop-rock');
    } else if (resource === 'fish') {
      itemClone = Objects.cloneDayObject('item-fish', 1100 + shiftX, 710 + shiftY);
      Audio.sfx('catch-fish');
    } else if (resource === 'wood') {
      let rand = Math.random() * 10;
      if (rand < 3.3) {
        itemClone = Objects.cloneDayObject('item-nails', 610 + shiftX * 2, 460 + shiftY * 2);
      } else if (rand < 6.6) {
        itemClone = Objects.cloneDayObject('item-plank', 620 + shiftX * 2, 470 + shiftY * 2);
      } else {
        itemClone = Objects.cloneDayObject('item-wood', 600 + shiftX * 2, 480 + shiftY * 2);
      }
      Audio.sfx('build-something');
    }
  
    if (itemClone) {
      itemClone.style.zIndex = 10;
      itemClone.classList.add('flip');
      dayContentContainer.appendChild(itemClone);
      window.setTimeout(function() {itemClone.classList.remove('flip');}, 10);  
    }
    
    collecting[hero].progress = 0;
    heroElement[hero].querySelector('.progress').style.width = 0;

  },

  putEquipment(slot, item) {

    for (var currentSlot in equipment[currentHero]) {
      if (equipment[currentHero][currentSlot] === item) {
        equipment[currentHero][currentSlot] = 'empty';
      }
    }

    equipment[currentHero][slot] = item;

    this.updateEquipment();

    if (slot === 'right' || slot === 'left') {
      if (item.startsWith('notebook-')) {
        Day.showNotebook(item);
      }
    }

    Objects.hide('hint-drag-book-to-learn');

  },

  putInventar(slot, item) {

    for (var currentSlot in inventar[currentHero]) {
      if (inventar[currentHero][currentSlot] === item) {
        inventar[currentHero][currentSlot] = 'empty';
      }
    }

    inventar[currentHero][slot] = item;

    this.updateInventar();
    Night.removeImportantItem(item);

    Objects.hide('hint-drag-book-to-learn');

  },

  removeFromInventar(item) {
    
    if (item) {
      for (var currentSlot in inventar[currentHero]) {
        if (inventar[currentHero][currentSlot] === item) {
          inventar[currentHero][currentSlot] = 'empty';
        }
      }
      this.updateInventar();
    }
  },

  fakeFinishCrafting(hero, cra) {
    crafting[hero].craft = cra;
    this.finishCrafting(hero);
  }

}
