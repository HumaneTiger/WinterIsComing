import Audio from './audio.js'
import Objects from './objects.js'
import Craft from './craft.js'
import Hero from './hero.js'

let dayContentContainer = document.querySelector('#day .day__content');
let darknessContainers = document.querySelectorAll('.darkness');

export default {
  
  init() {
    //dayContentContainer.appendChild(Objects.cloneDayObject('item-fishing', 1800, 710));
    //dayContentContainer.appendChild(Objects.cloneDayObject('item-axe', 1800, 710));
    //dayContentContainer.appendChild(Objects.cloneDayObject('item-hammer', 1400, 710));

    dayContentContainer.appendChild(Objects.cloneDayObject('item-nails', 1097, 525));

    dayContentContainer.appendChild(Objects.cloneDayObject('bush-1', 300, 680));
    dayContentContainer.appendChild(Objects.cloneDayObject('bush-2', 650, 50));
    dayContentContainer.appendChild(Objects.cloneDayObject('bush-1a', 50, 80));
    dayContentContainer.appendChild(Objects.cloneDayObject('bush-1a', 1750, 450));
    dayContentContainer.appendChild(Objects.cloneDayObject('bush-2a', 1120, 740));

    dayContentContainer.appendChild(Objects.cloneDayObject('tree-1a', 70, 470));
    dayContentContainer.appendChild(Objects.cloneDayObject('tree-2', 250, 190));
    dayContentContainer.appendChild(Objects.cloneDayObject('tree-3', 460, 70));
    dayContentContainer.appendChild(Objects.cloneDayObject('tree-1', 1240, 60));

    dayContentContainer.appendChild(Objects.cloneDayObject('rock-large', 1500, 160));
    dayContentContainer.appendChild(Objects.cloneDayObject('rock-small', 1280, 350));

    dayContentContainer.appendChild(Objects.cloneDayObject('signpost', 1040, 78));

    /* BOOKS */
    dayContentContainer.appendChild(Objects.cloneDayObject('notebook-camp', 745, 325));
    //dayContentContainer.appendChild(Objects.cloneDayObject('notebook-fish', 785, 365));
    //dayContentContainer.appendChild(Objects.cloneDayObject('notebook-workbench', 825, 405));
    //dayContentContainer.appendChild(Objects.cloneDayObject('notebook-home', 865, 445));

    /* HEROS */
    dayContentContainer.appendChild(Objects.cloneDayObject('hero-victor', 600, 450));
    dayContentContainer.appendChild(Objects.cloneDayObject('hero-christin', 500, 650));

    /* HINTS */
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-branch', 320, 620));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-stones', 1300, 330));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-learned-campfire', 844, 320));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-character-build', 844, 320));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-signpost', 900, 100));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-store-in-box', 1068, 260));
    dayContentContainer.appendChild(Objects.cloneDayObject('hint-drag-book-to-learn', 698, 220));

    window.setTimeout(function() {
      Objects.show('hint-drag-book-to-learn');
    }.bind(this), 10);

  },

  showNotebook(name) {

    if (!dayContentContainer.querySelector('.open-' + name)) {
      dayContentContainer.appendChild(Objects.cloneDayObject('open-' + name));
    }

    Objects.hide('hint-drag-book-to-learn');
    Objects.show('open-' + name);
    Audio.sfx('open-book');

    window.setTimeout(function() {
      dayContentContainer.querySelector('.open-' + name).classList.add('open');
    }.bind(this), 10);

  },

  hideNotebook() {

    let openNotebook = dayContentContainer.querySelector('.notebook.open');

    openNotebook.classList.remove('open');

    window.setTimeout(function(openNotebook) {
      openNotebook.classList.add('is--hidden');
    }.bind(this, openNotebook), 200);

    if (openNotebook.classList.contains('open-notebook-camp')) {

      Objects.show('hint-learned-campfire');
      Objects.show('hint-branch');
      Objects.show('hint-stones');

      Craft.unlock('campfire');

    } else if (openNotebook.classList.contains('open-notebook-fish')) {
      Craft.unlock('fishJetty');
    } else if (openNotebook.classList.contains('open-notebook-workbench')) {
      Craft.unlock('workbench');
    } else if (openNotebook.classList.contains('open-notebook-home')) {
      Craft.unlock('house');
    }

  },

  updateBrightness(todayHours) {

    let brightness;
    
    if (todayHours === 23) {
      document.getElementById('night-switch').classList.add('active');
    }

    if (todayHours > 15) {
      brightness = (todayHours - 15);
      darknessContainers[0].style.opacity = brightness / 12;
      darknessContainers[1].style.opacity = brightness / 15;
    } else {
      darknessContainers[0].style.opacity = 0;
      darknessContainers[1].style.opacity = 0;
    }
  }

}
