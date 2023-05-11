import Binding from './binding.js'
import Ui from './ui.js'
import Audio from './audio.js'
import Objects from './objects.js'
import Day from './day.js'
import Night from './night.js'
import Hero from './hero.js'
import Controls from './controls.js'
import Craft from './craft.js'

let tick = 0;
let ticksPerHour = 4;
let tickInterval = 700; // 700

let timeIsUnity = {
    gameHours: 0,
    gameDays: 0,
    todayHours: 1,
    todayTime: '01:00'
}

document.getElementById('start-game').addEventListener('mousedown', function() {
    document.getElementById('start').classList.remove('active');
    init();
});

function init() {

    Ui.init();
    Audio.init();
    Objects.init();
    Controls.init();
    Craft.init();

    bind();

    Ui.resizeWindow();
    
    Day.init();
    Night.init();
    Hero.init();

    initiateMainGameLoop();

}

function bind() {
    new Binding({
        object: timeIsUnity,
        property: 'gameDays',
        element: document.getElementById('gametime-days')
    })
    new Binding({
        object: timeIsUnity,
        property: 'todayTime',
        element: document.getElementById('gametime-hours')
    })
}

function initiateMainGameLoop() {

    window.setTimeout(function() {

        /* go foreward in time */

        tick += 1;

        /* TICKY TASKS */

        if (tick % ticksPerHour === 0) {
    
            timeIsUnity.gameHours += 1;

            Controls.updateGameDays(timeIsUnity.gameDays);

            /* HOURLY TASKS */

            Hero.hourlyTasks();

            Day.updateBrightness(timeIsUnity.todayHours);

            if (timeIsUnity.gameHours % 24 === 0) {

                Ui.pauseDay(true);

                timeIsUnity.gameDays += 1;

                /* DAILY TASKS */

                Controls.updateGameDays(timeIsUnity.gameDays);

            }
    
            timeIsUnity.todayHours = timeIsUnity.gameHours - timeIsUnity.gameDays * 24;
    
            timeIsUnity.todayTime = timeIsUnity.todayHours < 10 ? '0' + timeIsUnity.todayHours + ':00' : timeIsUnity.todayHours + ':00';

        }

        if (!Ui.isDayPaused()) {
            initiateMainGameLoop();
        } else {
            idleLoop();
        }

    }, tickInterval);

}

function idleLoop() {
    window.setTimeout(function() {
        if (!Ui.isDayPaused()) {
            initiateMainGameLoop();
        } else {
            idleLoop();
        }
    }, 500);
}

