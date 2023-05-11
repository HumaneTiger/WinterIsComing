import Objects from './objects.js'
import Hero from './hero.js'

let heroNight = document.querySelector('#night .hero');
let fogOfWar = document.querySelector('#night .fow');
let nightVersion1 = document.querySelector('#night .version-1');
let collisionIndicator = document.querySelector('#night .collision-indicator');

let gameModeDay = true;
let goBackPossible = false;

let iStuff, rStuff1, rStuff2, rStuff3;

let moveCmd = {
  right: false,
  left: false,
  top: false,
  bottom: false
};

let allCover = document.querySelectorAll('#night .cover');
let allEnemies = document.querySelectorAll('#night .enemie');
let loot = document.querySelector('#night .loot');

let importantStuff = {
  'item-axe': false,
  'item-hammer': false,
  'item-tape': false,
  'notebook-workbench': false,
  'item-nails': false,
  'item-saw': false,
  'notebook-fish': false,
  'item-fishing': false,
  'item-meter': false,
  'notebook-home': false,
  'item-tomato': false
}

let randStuff = [
  'item-food-2','item-gardening','item-knife','item-medicine','item-salt','item-sugar','item-snack-1','item-snack-2','item-soda-2','item-water','item-wine','item-carrot','item-onion','item-pea',
  'item-nails','item-pepper','item-shovel','item-shrooms','item-tomato','item-log','item-plank','item-fish','item-stones',
  'item-nails','item-shrooms','item-tomato','item-log','item-plank','item-branch','item-stones'
]

let versionA = {
  loot: [1750, 400],
  one: [1800, 710],
  two: [1600, 610],
  three: [1780, 360],
  four: [1600, 310]
}

let versionB = {
  loot: [1510, 818],
  one: [1780, 800],
  two: [1400, 880],
  three: [1100, 860],
  four: [1500, 670]
}

let versionC = {
  loot: [900, 330],
  one: [1100, 370],
  two: [1200, 275],
  three: [850, 500],
  four: [490, 300]
}

export default {
  
  init() {

    document.body.addEventListener('keydown', this.keyDown.bind(this));
    document.body.addEventListener('keyup', this.keyUp.bind(this));

    window.setInterval(() => {
      this.watchKeys();
    }, 10);

    window.setInterval(() => {
      this.watchCollisions();
    }, 200);

  },

  setGameModeDay(mode) {
    gameModeDay = mode;
  },

  prepareNight() {

    iStuff = 'item-tomato';

    heroNight.style.left = '50px';
    heroNight.style.top = '500px';

    if (fogOfWar) {
      fogOfWar.style.top = '-50px';
      fogOfWar.style.left = '-480px';
    }

    if (collisionIndicator) collisionIndicator.classList.remove('trigger');

    for (var stuff in importantStuff) {
      if (importantStuff[stuff] === false) {
        iStuff = stuff;
        break;
      }
    }

    rStuff1 = randStuff[Math.floor(Math.random()*randStuff.length)];
    rStuff2 = randStuff[Math.floor(Math.random()*randStuff.length)];
    rStuff3 = randStuff[Math.floor(Math.random()*randStuff.length)];

    if (iStuff && iStuff === 'item-nails') {
      rStuff1 = 'item-nails';
      rStuff2 = 'item-nails';
    }

    let rand = Math.random() * 100;
    
    if (rand < 33) {
      if (loot) { loot.style.left = versionA.loot[0] + 'px'; loot.style.top = versionA.loot[1] + 'px';  }
      if (iStuff) nightVersion1.appendChild(Objects.cloneDayObject(iStuff, versionA.one[0], versionA.one[1]));
      if (rStuff1) nightVersion1.appendChild(Objects.cloneDayObject(rStuff1, versionA.two[0], versionA.two[1]));
      if (rStuff2) nightVersion1.appendChild(Objects.cloneDayObject(rStuff2, versionA.three[0], versionA.three[1]));
      if (rStuff3) nightVersion1.appendChild(Objects.cloneDayObject(rStuff3, versionA.four[0], versionA.four[1]));
    } else if (rand < 66) {
      if (loot) { loot.style.left = versionB.loot[0] + 'px'; loot.style.top = versionB.loot[1] + 'px';  }
      if (iStuff) nightVersion1.appendChild(Objects.cloneDayObject(iStuff, versionB.one[0], versionB.one[1]));
      if (rStuff1) nightVersion1.appendChild(Objects.cloneDayObject(rStuff1, versionB.two[0], versionB.two[1]));
      if (rStuff2) nightVersion1.appendChild(Objects.cloneDayObject(rStuff2, versionB.three[0], versionB.three[1]));
      if (rStuff3) nightVersion1.appendChild(Objects.cloneDayObject(rStuff3, versionB.four[0], versionB.four[1]));
    } else {
      if (loot) { loot.style.left = versionC.loot[0] + 'px'; loot.style.top = versionC.loot[1] + 'px';  }
      if (iStuff) nightVersion1.appendChild(Objects.cloneDayObject(iStuff, versionC.one[0], versionC.one[1]));
      if (rStuff1) nightVersion1.appendChild(Objects.cloneDayObject(rStuff1, versionC.two[0], versionC.two[1]));
      if (rStuff2) nightVersion1.appendChild(Objects.cloneDayObject(rStuff2, versionC.three[0], versionC.three[1]));
      if (rStuff3) nightVersion1.appendChild(Objects.cloneDayObject(rStuff3, versionC.four[0], versionC.four[1]));
    }

  },

  removeImportantItem(item) {
    if (importantStuff[item] === false) {
      importantStuff[item] = true;
    }
  },

  watchCollisions() {

    if (!gameModeDay) {

      let heroOffset = heroNight.getBoundingClientRect();
      let heroCover = false;
      let padding = 20;

      let lootOffset = loot.getBoundingClientRect();

      if (heroOffset.right > lootOffset.left &&
        heroOffset.left < lootOffset.right &&
        heroOffset.bottom > lootOffset.top &&
        heroOffset.top < lootOffset.bottom) {
      }

      allCover.forEach(cover => {

        let coverOffset = cover.getBoundingClientRect();

        if (heroOffset.right - padding > coverOffset.left &&
            heroOffset.left + padding < coverOffset.right &&
            heroOffset.bottom - padding > coverOffset.top &&
            heroOffset.top + padding < coverOffset.bottom) {

              cover.classList.add('transparent');
              heroCover = true;

        } else {
              cover.classList.remove('transparent');
        }
      })

      if (heroCover) {
        heroNight.classList.add('in-cover');
      } else {
        heroNight.classList.remove('in-cover');
      }

      if (!heroCover) {

        let scale = window.innerHeight / 1080;

        let heroMiddleX = heroOffset.left + (heroOffset.right - heroOffset.left) / 2,
            heroMiddleY = heroOffset.top + (heroOffset.bottom - heroOffset.top) / 2;

        allEnemies.forEach(enemie => {
          let enemieOffset = enemie.getBoundingClientRect();

          let enemieMiddleX = enemieOffset.left + (enemieOffset.right - enemieOffset.left) / 2,
              enemieMiddleY = enemieOffset.top + (enemieOffset.bottom - enemieOffset.top) / 2;

          let a = heroMiddleX - enemieMiddleX;
          let b = heroMiddleY - enemieMiddleY;
          
          let distance = Math.sqrt( a*a + b*b );

          if (distance / scale < 240) {
            this.triggerCollision();
          }

        });
      }
    }
  },

  triggerCollision() {

    if (collisionIndicator) collisionIndicator.classList.add('trigger');

    if (iStuff) {
      importantStuff[iStuff] = false;
      Hero.removeFromInventar(iStuff);
    }

    Hero.removeFromInventar(rStuff1);
    Hero.removeFromInventar(rStuff2);
    Hero.removeFromInventar(rStuff3);

    window.setTimeout(() => {
      heroNight.style.left = '50px';
      heroNight.style.top = '500px';
      document.getElementById('night-collision').classList.add('active');
    }, 1000);

  },

  watchKeys() {

    if (!gameModeDay) {

      let targetLeft = 0,
          targetTop = 0;
      let heroLeft = parseInt(heroNight.style.left, 10),
          heroTop = parseInt(heroNight.style.top, 10);

      if (moveCmd.right && heroLeft < 1740) targetLeft = 1;
      if (moveCmd.left && heroLeft > 40) targetLeft = -1;
      if (moveCmd.down && heroTop < 970) targetTop = 1;
      if (moveCmd.up && heroTop > -20) targetTop = -1;

      if (targetLeft !== 0 || targetTop !== 0) {

        heroNight.style.left = (heroLeft + targetLeft) + 'px';
        heroNight.style.top = (heroTop + targetTop) + 'px';

        if (fogOfWar) {
          fogOfWar.style.left = (parseInt(fogOfWar.style.left, 10) + targetLeft) + 'px';
          fogOfWar.style.top = (parseInt(fogOfWar.style.top, 10) + targetTop) + 'px';  
        }

        if (heroLeft > 120) {
          goBackPossible = true;
        }

        if (goBackPossible && targetLeft === -1 && heroLeft < 55 && heroTop > 300 && heroTop < 700) {
          document.getElementById('day-switch').classList.add('active');
        }

      }

    }

  },

  keyDown(e) {

    if (!gameModeDay) {
      let move;

      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        move = "up";
      } else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        move = "down";
      } else if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        move = "left";
      } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        move = "right";
      }

      if (move === 'up' && !moveCmd.up) {
        moveCmd.up = true;
        this.watchKeys();
      } else if (move === 'down' && !moveCmd.down) {
        moveCmd.down = true;
        this.watchKeys();
      }

      if (move === 'right' && !moveCmd.right) {
        moveCmd.right = true;
        this.watchKeys();
      } else if (move === 'left' && !moveCmd.left) {
        moveCmd.left = true;
        this.watchKeys();
      }
    }

  },

  keyUp(e) {

    if (!gameModeDay) {
      let stop;
      
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        stop = "up";
      } else if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        stop = "down";
      } else if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        stop = "left";
      } else if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        stop = "right";
      }
      if (stop === 'up' && moveCmd.up) {
        moveCmd.up = false;
        this.watchKeys();
      } else if (stop === 'down' && moveCmd.down) {
        moveCmd.down = false;
        this.watchKeys();
      }

      if (stop === 'right' && moveCmd.right) {
        moveCmd.right = false;
        this.watchKeys();
      } else if (stop === 'left' && moveCmd.left) {
        moveCmd.left = false;
        this.watchKeys();
      }
    }
  }

}
  