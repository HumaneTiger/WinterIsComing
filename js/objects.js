let dayObjectsContainer = document.querySelector('#day .day__objects');
let dayContentContainer = document.querySelector('#day .day__content');

export default {
  
    init() {

      this.createDayObjects();
    },

    show(name) {
      var el = name instanceof HTMLElement ? name : dayContentContainer.querySelector('.' + name);
      el?.classList.remove('is--hidden');
    },

    hide(name) {
      var el = name instanceof HTMLElement ? name : dayContentContainer.querySelector('.' + name);
      el?.classList.add('is--hidden');
    },

    cloneDayObject(name, posX, posY) {

      let cloneObject = dayObjectsContainer.querySelector('.' + name);

      if (cloneObject) {

        let cloneEl = cloneObject.cloneNode(true);
        
        if (posX) cloneEl.style.left = posX + 'px';
        if (posY) cloneEl.style.top = posY + 'px';

        return cloneEl;

      } else {

        console.log('Clone object missing: ', name);

        return false;

      }

    },

    createDayObjects() {

      var items = [
        'axe',
        'backbag',
        'bag',
        'bat',
        'flower',
        'food-1',
        'food-2',
        'gardening',
        'hammer',
        'knife',
        'medicine',
        'meter',
        'notebook',
        'pen',
        'rock',
        'salt',
        'saw',
        'schere',
        'schluessel',
        'sizzor',
        'snack-1',
        'snack-2',
        'soap',
        'soda-1',
        'soda-2',
        'sugar',
        'tape',
        'water',
        'wine',
        'wood',
        'zange',
        'zange-2',
        'branch',
        'carrot',
        'fishing',
        'onion',
        'nails',
        'pea',
        'pepper',
        'shovel',
        'shrooms',
        'tomato',
        'log',
        'plank',
        'fish',
        'stones',
        'lighter',
        'fireplace'
      ];
  
      var heros = [
        'victor',
        'christin'
      ];
  
      var hints = [
        'branch',
        'stones',
        'drag-book-to-learn',
        'learned-campfire',
        'character-build',
        'signpost',
        'store-in-box',
        'unknown-crafting'
      ];
  
      items.forEach(item => {
        let childEl = '<div class="item item-' + item + '">' +
            '<div class="shadow"></div>' +
            '<img src="img/neutrals/item-chip.png" class="background" width="82" height="82">' +
            '<img src="img/items/' + item + '.png" class="icon" width="auto" height="auto">' +
          '</div>';
          dayObjectsContainer.innerHTML += childEl;
      });
  
      heros.forEach(hero => {
        let childEl = '<div class="hero hero-' + hero + '">' +
            '<div class="shadow"></div>' +
            '<img src="img/neutrals/hero-chip.png" class="background" width="100%" height="auto">' +
            '<img src="img/heros/' + hero + '.png" class="icon" width="100%" height="auto">' +
            '<div class="bubble is--hidden"><div class="text">...</div></div>' +
            '<div class="activity"><div class="progress"></div><div class="text">collecting...</div></div>' +
          '</div>';
          dayObjectsContainer.innerHTML += childEl;
      });
  
      hints.forEach(hint => {
        let childEl = '<img src="img/hints/' + hint + '.png"  class="hint hint-' + hint + ' is--hidden" width="180" height="auto">';
          dayObjectsContainer.innerHTML += childEl;
      });
  
    }
  
  }  
  
  
  