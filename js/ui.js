import Audio from './audio.js'
import Hero from './hero.js'
import Day from './day.js'
import Night from './night.js'
import Objects from './objects.js';
import Craft from './craft.js';
import Controls from './controls.js';

let dayContentContainer = document.querySelector('#day .day__content');

let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0, initialStyleLeft = 0, initialStyleTop = 0;
let dragMode = false;

let gameModeDay = true;
let pauseDay = false;

let zIndexExchange = 1;

let dragEl = null;
let topIndex = 12;

let equipmentSlots = [
  'left',
  'right',
  'pocket'
];

let inventarSlots = [
  'inv1', 'inv2', 'inv3', 'inv4', 'inv5', 'inv6'
];

export default {
  
  init() {

    window.addEventListener('resize', this.resizeWindow);

    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);

    document.addEventListener('mouseup', this.mouseUp.bind(this));
    
    Audio.music('day-isabel_woodings');

  },
  
  resizeWindow() {

    document.getElementById('day').style.transform = 'scale(' + (window.innerHeight / 1080) + ') translateX(-50%)';
    document.getElementById('night').style.transform = 'scale(' + (window.innerHeight / 1080) + ') translateX(-50%)';

  },

  setGameModeDay(mode) {
    gameModeDay = mode;
  },

  pauseDay(mode) {
    pauseDay = mode;
  },

  isDayPaused() {
    return pauseDay;
  },

  mouseUp(e) {

    if (dragMode) {

      let equipmentTarget = this.getValidSlotTarget(e, equipmentSlots);
      let environmentTarget = this.getEnvironmentDragTarget(e);
      let inventarTarget = this.getValidSlotTarget(e, inventarSlots);
      let reciepeTarget = this.getReciepeDragTarget(e);
      let craftTarget = this.getCraftDragTarget(e);
      let crateTarget = this.getCrateDragTarget(e);

      if (equipmentTarget?.classList.contains('slot--empty')) {
        this.storeDragEl(equipmentTarget);
        Audio.sfx('click');
        Hero.removeElement(dragEl);
      } else if (inventarTarget?.classList.contains('slot--empty')) {
        this.storeDragEl(inventarTarget);
        Audio.sfx('click');
        Hero.removeElement(dragEl);
      } else if (reciepeTarget?.classList.contains('slot--reciepe')) {
        if (this.getItemFromEl(dragEl) === this.getItemFromEl(reciepeTarget)) {
          Objects.hide('hint-learned-campfire');
          let done = Craft.put(reciepeTarget.closest('.craft').id, this.getItemFromEl(reciepeTarget));
          if (done) {
            Hero.removeElement(dragEl);
            Craft.checkForComplete(reciepeTarget.closest('.craft'));
            reciepeTarget?.classList.remove('slot--reciepe');
            reciepeTarget?.classList.add('slot--done');
          } else {
            Hero.removeElement(dragEl);
          }
        } else {
          this.resetDraggedElement(dragEl);
        }
      } else if (dragEl?.classList.contains('item') && crateTarget) {
        Controls.stockpileItem(dragEl);
        Audio.sfx('wooden-box');
        Hero.removeElement(dragEl);
      } else if (dragEl?.classList.contains('hero') && craftTarget) {
        Hero.startCrafting(dragEl, craftTarget);
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('bush-1')) {
        Hero.startCollecting(dragEl, 'branch');
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('tree-3')) {
        Hero.startCollecting(dragEl, 'log');
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('rock-small')) {
        Hero.startCollecting(dragEl, 'stones');
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('rock-large')) {
        Hero.startCollecting(dragEl, 'rock');
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('fish-jetty-ready')) {
        Hero.startCollecting(dragEl, 'fish');
      } else if (dragEl?.classList.contains('hero') && environmentTarget?.classList.contains('workbench-ready')) {
        Hero.startCollecting(dragEl, 'wood');
      } else if (dragEl?.classList.contains('item') && environmentTarget?.classList.contains('exchange')) {
        dragEl?.classList.remove('grabbed');
        let item;
        dragEl.classList.forEach(className => {
          if (className.startsWith('item-') || className.startsWith('notebook-')) {
            item = className;
          }
        });
        if (item) {
          let itemClone = Objects.cloneDayObject(item, 1080 + Math.floor(Math.random() * 50), 500 + Math.floor(Math.random() * 50));
          itemClone.style.zIndex = zIndexExchange++;
          dayContentContainer.appendChild(itemClone);
          if (item === 'notebook-camp') {
            Objects.hide('hint-drag-book-to-learn');            
          }
        }
        Hero.removeElement(dragEl);
      } else {
        this.resetDraggedElement(dragEl);
      }
  
      dragMode = false;
      dragEl = null;
  
    }

  },

  resetDraggedElement(el) {
    el.style.left = initialStyleLeft;
    el.style.top = initialStyleTop;
    el.classList.remove('grabbed');
    if (el.classList.contains('hero')) {
      if (Hero.getPauseActivity(el) === true) {
        el.classList.add('active');
        Hero.setPauseActivity(el, false);
      }
    }
  },

  getItemFromEl(el) {
    let item;
    el.classList.forEach(className => {
      if (className.startsWith('item-')) {
        item = className.substr(5);
      }
    });

    return item;
  },

  storeDragEl(dragTarget) {

    let targetClassList = dragTarget.classList;

    equipmentSlots.forEach(slot => {
      if (targetClassList.contains('slot-' + slot) && targetClassList.contains('slot--empty')) {
        dragEl.classList.forEach(className => {
          if (className.startsWith('item-') || className.startsWith('notebook-')) {
            Hero.putEquipment(slot, className);
          }
        });
      }
    });

    inventarSlots.forEach(slot => {
      if (targetClassList.contains('slot-' + slot) && targetClassList.contains('slot--empty')) {
        dragEl.classList.forEach(className => {
          if (className.startsWith('item-') || className.startsWith('notebook-')) {
            Hero.putInventar(slot, className);
          }
        });
      }
    });

  },

  getValidSlotTarget(e, slotCandidates) {

    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let targetCandidateFound;

    slotCandidates.forEach(candidate => {

      let targetCandidate = gameModeDay ? document.getElementsByClassName('slot-' + candidate)[0] : document.getElementsByClassName('slot-' + candidate)[1];

      if (targetCandidate) {

        let viewportOffset = targetCandidate.getBoundingClientRect();
        
        if (mouseX >= viewportOffset.left &&
            mouseX <= viewportOffset.right &&
            mouseY >= viewportOffset.top &&
            mouseY <= viewportOffset.bottom) {
            
            targetCandidateFound = targetCandidate;
        }

      }
      
    });
    
    return targetCandidateFound;

  },

  getEnvironmentDragTarget(e) {

    let targetCandidateFound;
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let targetCandidates = [
      'bush-1',
      'tree-3',
      'rock-small',
      'rock-large',
      'exchange',
      'fish-jetty-ready',
      'workbench-ready'
    ];

    targetCandidates.forEach(candidate => {

      let targetCandidate = document.getElementsByClassName(candidate)[0];

      if (targetCandidate) {

        let viewportOffset = targetCandidate.getBoundingClientRect();

        if (mouseX >= viewportOffset.left &&
            mouseX <= viewportOffset.right &&
            mouseY >= viewportOffset.top &&
            mouseY <= viewportOffset.bottom) {
            
            targetCandidateFound = targetCandidate;
        }

      }

    });

    return targetCandidateFound;

  },

  getReciepeDragTarget(e) {

    let targetCandidateFound;
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let targetCandidates = document.getElementById('day').querySelectorAll('.slot--reciepe:not(.is--hidden)');

    targetCandidates.forEach(targetCandidate => {

      let viewportOffset = targetCandidate.getBoundingClientRect();

      if (mouseX >= viewportOffset.left &&
          mouseX <= viewportOffset.right &&
          mouseY >= viewportOffset.top &&
          mouseY <= viewportOffset.bottom) {
          
          targetCandidateFound = targetCandidate;
      }

    });

    return targetCandidateFound;

  },

  getCraftDragTarget(e) {

    let targetCandidateFound;
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let targetCandidates = document.getElementById('day').querySelectorAll('.craft.craft--ready');

    targetCandidates.forEach(targetCandidate => {

      let viewportOffset = targetCandidate.getBoundingClientRect();

      if (mouseX >= viewportOffset.left &&
          mouseX <= viewportOffset.right &&
          mouseY >= viewportOffset.top &&
          mouseY <= viewportOffset.bottom) {
          
          targetCandidateFound = targetCandidate;
      }

    });

    return targetCandidateFound;

  },

  getCrateDragTarget(e) {

    let targetCandidate = document.querySelector('.day__content .crate');
    let targetCandidateFound;
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let viewportOffset = targetCandidate.getBoundingClientRect();

    if (mouseX >= viewportOffset.left &&
        mouseX <= viewportOffset.right &&
        mouseY >= viewportOffset.top &&
        mouseY <= viewportOffset.bottom) {
        
        targetCandidateFound = targetCandidate;
    }

    return targetCandidateFound;

  },

  getInventarDragTarget(e) {

    let targetCandidateFound;

    return targetCandidateFound;

  },

  mouseDown(e) {

    let target = e.target;

    // don't drag hero at night
    if (gameModeDay || (!gameModeDay && !target.closest('div.hero'))) {

      if (target) {

        if ( dragMode === false && (target.closest('div.item') || target.closest('div.hero')) && !target.closest('div.item-backbag')) {
    
          dragMode = true;
    
          dragEl = target.closest('div.item') || target.closest('div.hero');
    
          dragEl.style.zIndex = topIndex++;
          dragEl.classList.add('grabbed');
          
          startPosX = dragEl.clientX;
          startPosY = dragEl.clientY;
  
          initialStyleLeft = dragEl.style.left;
          initialStyleTop = dragEl.style.top;
  
          Audio.sfx('click');

        } else {
  
          if (target.closest('div.notebook')) {
            Day.hideNotebook();
          }
  
          if (target.closest('.hint')) {
            Objects.hide(target.closest('.hint'));
          }
  
          if (target.closest('.crate')) {
            Objects.show('hint-store-in-box');
          }

          if (target.closest('.switch__dialog')) {
            if (target.classList.contains('switch--yes')) {
              if (target.closest('#tutorial')) {
                target.closest('#tutorial').classList.remove('active');
              }
              if (target.closest('#day-switch') || target.closest('#night-collision')) {
                document.getElementById('night').classList.add('is--hidden');
                document.getElementById('day').classList.remove('is--hidden');
                document.getElementById('day-switch').classList.remove('active');
                document.getElementById('night-collision').classList.remove('active');
                gameModeDay = true;
                pauseDay = false;
                Night.setGameModeDay(gameModeDay);
                Audio.stop('night-1');
                Audio.stop('night-2');
                Audio.music('day-isabel_woodings');
              }
            } else if (target.classList.contains('switch--no')) {
              if (target.closest('#day-switch')) {
                document.getElementById('day-switch').classList.remove('active');
              }
              if (target.closest('#night-switch')) {
                document.getElementById('night-switch').classList.remove('active');
                gameModeDay = true;
                pauseDay = false;
                Night.setGameModeDay(gameModeDay);
              }
            } else if (target.classList.contains('victor')) {
              Hero.setCurrentHero('victor');
              document.getElementById('day').classList.add('is--hidden');
              document.getElementById('night-switch').classList.remove('active');
              document.getElementById('night').classList.remove('is--hidden');
              gameModeDay = false;
              Night.prepareNight();
              Night.setGameModeDay(gameModeDay);
              Audio.stop('day-isabel_woodings');
              Audio.music('night-2');
            } else if (target.classList.contains('christin')) {
              Hero.setCurrentHero('christin');
              document.getElementById('day').classList.add('is--hidden');
              document.getElementById('night-switch').classList.remove('active');
              document.getElementById('night').classList.remove('is--hidden');
              gameModeDay = false;
              Night.prepareNight();
              Night.setGameModeDay(gameModeDay);
              Audio.stop('day-isabel_woodings');
              Audio.music('night-2');
            }
          }
        }
  
        if (target.classList.contains('hero')) {
          if (target.classList.contains('hero-victor')) {
            Hero.setCurrentHero('victor');
          } else {
            Hero.setCurrentHero('christin');
          }
  
        }
    
      }
    }

  },

  mouseMove(e) {

    e.preventDefault;
    e.stopPropagation();
    
    if (dragMode) {

      let scale = window.innerHeight / 1080;

      // calculate the new position
      newPosX = (startPosX - e.clientX) / scale;
      newPosY = (startPosY - e.clientY) / scale;
  
      // with each move we also want to update the start X and Y
      startPosX = e.clientX;
      startPosY = e.clientY;

      if (dragEl) {
        // set the element's new position:
        dragEl.style.top = (dragEl.offsetTop - newPosY) + "px";
        dragEl.style.left = (dragEl.offsetLeft - newPosX) + "px";
      }

      if (dragEl.classList.contains('hero') && dragEl.classList.contains('active')) {
        Hero.setPauseActivity(dragEl, true);
        dragEl.classList.remove('active');
      }

    }
  
  }
}

