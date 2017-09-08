import { Playground } from '../playground';
import { PlayGroundConfigurator } from '../playgroundconfigurator';
import { Direction } from '../move/direction';

export class Game {

    images = {};
    audios = {};

    liveCount = 3;
    end = false;
    playGroundConfugurator = null;
    playGround = null;
    startedAt = null;
    hero = null;
    animator = null;

    counterTag;
    livesTag;

    constructor (resources) {
        this.images = resources.images;
        this.audios = resources.audios;
        this.counterTag = document.getElementById('picks');
        this.livesTag = document.getElementById('lives');
    }

    setUpPlayGround = () => {

        var playGroundElement = document.getElementById('play-ground');
        playGroundElement.innerHTML = '';
        this.counterTag.innerHTML = '';

        this.playGround = new PlayGround(playGroundElement, 600, 800);

        this.playGround.setPickItUpCallBack(this.picked);
        this.playGround.setTargetCaughtCallBack(this.caught);

        this.playGroundConfugurator = new PlayGroundConfigurator(this.playGround, this.images);
        this.playGroundConfugurator.configure();

        var l = document.getElementById('lives');
        l.innerHTML = '';
        for (var i = 0; i < this.liveCount; i++) {
            var im = new Image();
            im.src = this.images['hero-right'].getImageSource();
            im.height = 32;
            im.width = 32;
            l.appendChild(im);
        }

        this.placeHero();
        //this.placeCockpit();
    };

    placeCockpit = () => {
        //var cockpit = document.getElementById('game-cockpit');
        ////cockpit.innerHTML = '';
        //cockpit.style.position = 'absolute';
        //cockpit.style.top = '700px';
        //cockpit.style.left = '750px';
    };

    placeHero = () => {
        this.playGround.removeGameElement(this.hero);

        var heroImages = {};
        heroImages['up'] = this.images['hero-up'];
        heroImages['down'] = this.images['hero-down'];
        heroImages['left'] = this.images['hero-left'];
        heroImages['right'] = this.images['hero-right'];

        this.hero = this.playGround.createPicture(5, 5, heroImages['right']);
        this.animator = new TagAnimator(this.hero, this.playGround);
        this.animator.setImages(heroImages);
        this.playGround.addTarget(this.hero);
    };

    picked = (pickItUps) => {

        if(pickItUps.length == 0)return;

        var i;
        for(i = 0; i < pickItUps.length; i++){
            var pickItUp = pickItUps[i];
            var top = pickItUp.top;
            var left = pickItUp.left;

            this.playGround.removeGameElement(pickItUp);

            var finished = this.playGround.getPickItUps().length == 0;

            var im = new Image();
            im.src = this.images['diamond'].getImageSource();
            this.counterTag.appendChild(im);

            if (finished) {
                new ModalMessage(-1, ModalMessage.Cheer, 'You Win!!', this.playGround).show();
                this.audios['win'].volume = '0.2';
                this.audios['win'].play();
                this.shutDownGame();
            } else {
                this.playGround.showNotification(0.05, ModalMessage.Cheer, top, left, 'Pick!!');
                this.audios['pick'].play();
            }

        }

    };

    caught = (target) => {

        this.animator.stop();

        var current = this.livesTag.childElementCount;
        this.livesTag.removeChild(this.livesTag.firstElementChild);
        var next = current - 1;
        if (next <= 0) {
            new ModalMessage(-1, ModalMessage.BadNews, 'Lost!!', this.playGround).show();
            this.audios['lost'].volume = 0.2;
            this.audios['lost'].play();
            this.shutDownGame();
        } else {
            target.clear();
            this.playGround.removeGameElement(this.animator.element);
            new ModalMessage(5000, ModalMessage.BadNews, 'Caught!!', this.playGround).show();
            this.audios['caught'].volume = 0.2;
            this.audios['caught'].play();

            this.placeHero();
            this.playGround.shieldTarget(this.hero, 7000);
            this.animator.start();
        }
    };

    setKeyDown = (keyCode) => {
        if (!this.animator) return;
        this.animator.setKeyDown(keyCode);
    };

    setKeyUp = (keyCode) => {
        if (!this.animator) return;
        this.animator.setKeyUp(keyCode);
    };

    startGame = () => {
        var that = this;
        document.onkeydown = function(e){
            let event = window.event ? window.event : e;
            var keyCode = event.keyCode;
            var dir;

            switch(keyCode){
                case 37:
                    dir = Direction.left;
                    break;
                case 39:
                    dir = Direction.right;
                    break;
                case 38:
                    dir = Direction.up;
                    break;
                case 40:
                    dir = Direction.down;
                    break;
            }
            this.animator.addToActiveDirections(dir);
        };
        document.onkeyup = function(e){
            var event = window.event ? window.event : e;
            var keyCode = event.keyCode;
            var dir;
            switch(keyCode){
                case 37:
                    dir = Direction.left;
                    break;
                case 39:
                    dir = Direction.right;
                    break;
                case 38:
                    dir = Direction.up;
                    break;
                case 40:
                    dir = Direction.down;
                    break;
            }
            this.animator.removeFromActiveDirections(dir);
        };

        if (this.end) {
            this.resetGame();
            return;
        }
        this.audios['loop'].loop = true;
        this.audios['loop'].volume = 0.8;
        this.audios['loop'].play();

        this.animator.start();
        this.playGround.startMovers();
        //this.playGround.shieldTarget(this.hero, 2000);
        this.startedAt = null;
        this.end = false;
        document.getElementById('time').innerHTML = '00:00:00';
        timeCount(document.getElementById('time'));
    };

    resetGame = () => {
        if (!this.end)this.shutDownGame();
        ModalMessage.clearAll();
        this.end = false;
        this.setUpPlayGround();
        this.startGame();
    };

    shutDownGame = () => {
        this.end = true;
        this.audios['loop'].load();
        this.playGround.stopMovers();
        document.onkeydown = null;
        document.onkeyup = null;
        this.animator.stop();
        this.animator = null;
    };

    resumeGame = () => {
        this.playGround.endPause();
    };

    pauseGame = (milli=> s) {
        this.playGround.pause();
        if (millis) {
            return setTimeout(this.resumeGame, millis);
        }
    };

    isPaused = () => {
        return this.playGround.isPaused();
    };

}