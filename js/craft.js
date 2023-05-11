import Binding from './binding.js'
import Objects from './objects.js'

let crafting = {
  "campfire": {
    "branch": { ist: 0, soll: 6 },
    "stones": { ist: 0, soll: 4 }
  },
  "fishJetty": {
    "log": { ist: 0, soll: 8 },
    "plank": { ist: 0, soll: 4 },
    "nails": { ist: 0, soll: 2 }
  },
  "workbench": {
    "log": { ist: 0, soll: 6 },
    "rock": { ist: 0, soll: 2 },
    "nails": { ist: 0, soll: 2 },
    "tape": { ist: 0, soll: 1 }
  },
  "house": {
    "branch": { ist: 0, soll: 20 },
    "log": { ist: 0, soll: 12 },
    "rock": { ist: 0, soll: 18 },
    "wood": { ist: 0, soll: 15 },
    "plank": { ist: 0, soll: 10 },
    "nails": { ist: 0, soll: 4 }
  }
}

export default {
  
  init() {
    this.bind();
  },

  bind() {
    for (var container in crafting) {
      for (var item in crafting[container]) {
        new Binding({
          object: crafting[container][item],
          property: 'ist',
          element: document.getElementById(container + '-' + item)
        })
      }
    }
  },

  unlock(name) {

    let craftContainer = document.getElementById(name);

    if (craftContainer) {
      let allUnknownSlots = craftContainer.querySelectorAll('.slot--unknown');
      let allReciepeSlots = craftContainer.querySelectorAll('.slot--reciepe');

      allUnknownSlots.forEach(slot => {
        slot.classList.add('is--hidden');
      })

      allReciepeSlots.forEach(slot => {
        slot.classList.remove('is--hidden');
      })

    }
  },

  put(container, item) {
    crafting[container][item].ist += 1;
    if (crafting[container][item].ist >= crafting[container][item].soll) {
      return true;
    } else {
      return false;
    }
  },

  checkForComplete(craftContainer) {
    let id = craftContainer.id;
    for (var item in crafting[id]) {
      if (crafting[id][item].ist < crafting[id][item].soll) {
        return;
      }
    }
    craftContainer.classList.add('craft--ready');
    if (id === 'campfire') {
      Objects.show('hint-character-build');
    }
  }

}
