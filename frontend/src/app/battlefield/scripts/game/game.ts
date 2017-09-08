import { PlayGround } from '../playground';
import { PlayGroundConfigurator } from '../playgroundconfigurator';
import { Direction } from '../move/direction';
import { HeroAnimator } from '../move/heroanimator';
import { ModalMessage } from '../messages/modalmessage';
import {Bomb} from "../../../models/bomb";

export class Game {

    direction: Direction = new Direction();

    images = {};
    audios = {};

    liveCount = 3;
    end = false;
    playGroundConfigurator = null;
    public playGround: PlayGround = null;
    startedAt = null;
    hero = null;
    animator = null;

    counterTag;
    livesTag;

    constructor (resources) {
        this.images = resources.images;
        this.audios = resources.audios;
        // this.counterTag = document.getElementById('picks');
        // this.livesTag = document.getElementById('lives');
    }

    setUpPlayGround() {

        var playGroundElement = document.getElementById('playground');
        playGroundElement.innerHTML = '';
        // this.counterTag.innerHTML = '';

        this.playGround = new PlayGround(playGroundElement, 544, 544);

        this.playGround.setPickItUpCallBack(this.picked);
        this.playGround.setTargetCaughtCallBack(this.caught);

        this.playGroundConfigurator = new PlayGroundConfigurator(this.playGround, this.images);
        this.playGroundConfigurator.configure();


        // var l = document.getElementById('lives');
        // l.innerHTML = '';
        // for (var i = 0; i < this.liveCount; i++) {
        //     var im = new Image();
        //     im.src = this.images['hero-right'].getImageSource();
        //     im.height = 32;
        //     im.width = 32;
        //     l.appendChild(im);
        // }

        this.placeHero();
        this.placeBomb(4,4);
        this.placeBomb(7,7);
        //this.placeCockpit();
        this.startGame();
    };

    placeCockpit() {
        //var cockpit = document.getElementById('game-cockpit');
        ////cockpit.innerHTML = '';
        //cockpit.style.position = 'absolute';
        //cockpit.style.top = '700px';
        //cockpit.style.left = '750px';
    };

    placeHero() {
        this.playGround.removeGameElement(this.hero);

        var heroImages = {};
        heroImages['up'] = this.images['hero-1-u'];
        heroImages['down'] = this.images['hero-1-d'];
        heroImages['left'] = this.images['hero-1-l'];
        heroImages['right'] = this.images['hero-1-r'];

        this.hero = this.playGround.createPicture(32, 32, heroImages['right']);
        this.animator = new HeroAnimator(this.hero, this.playGround);
        this.animator.setImages(heroImages);
        this.playGround.addTarget(this.hero);
    };

    // FIXME:
    public placeBomb(x: number, y: number): void {
       this.playGround.createPicture(x*32, y*32,  this.images['bomb1']);
       this.playGround.addBomb(new Bomb(null, x, y, null, null));
    }

    picked(pickItUps) {

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

    caught(target: any):void {

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

    setKeyDown(keyCode):void {
        if (!this.animator) return;
        this.animator.setKeyDown(keyCode);
    };

    setKeyUp(keyCode) {
        if (!this.animator) return;
        this.animator.setKeyUp(keyCode);
    };

    startGame(){
        document.onkeydown = (e) => {
            let event: any = window.event ? window.event : e;
            var keyCode = event.keyCode;
            var dir;

            switch(keyCode){
                case 37:
                    dir = this.direction.left;
                    break;
                case 39:
                    dir = this.direction.right;
                    break;
                case 38:
                    dir = this.direction.up;
                    break;
                case 40:
                    dir = this.direction.down;
                    break;
                case 32:
                    this.placeBomb(5,5);
                    break;
            }
            this.animator.addToActiveDirections(dir);
        };
        document.onkeyup = (e) => {
            var event: any = window.event ? window.event : e;
            var keyCode = event.keyCode;
            var dir;
            switch(keyCode){
                case 37:
                    dir = this.direction.left;
                    break;
                case 39:
                    dir = this.direction.right;
                    break;
                case 38:
                    dir = this.direction.up;
                    break;
                case 40:
                    dir = this.direction.down;
                    break;
            }
            this.animator.removeFromActiveDirections(dir);
        };

        if (this.end) {
            this.resetGame();
            return;
        }
        // this.audios['loop'].loop = true;
        // this.audios['loop'].volume = 0.8;
        // this.audios['loop'].play();

        this.animator.start();
        // this.playGround.startMovers();
        //this.playGround.shieldTarget(this.hero, 2000);
        this.startedAt = null;
        this.end = false;
    };

    resetGame() {
        if (!this.end)this.shutDownGame();
        ModalMessage.clearAll();
        this.end = false;
        this.setUpPlayGround();
        this.startGame();
    };

    shutDownGame() {
        this.end = true;
        this.audios['loop'].load();
        this.playGround.stopMovers();
        document.onkeydown = null;
        document.onkeyup = null;
        this.animator.stop();
        this.animator = null;
    };

    resumeGame() {
        this.playGround.endPause();
    };

    pauseGame(millis) {
        this.playGround.pause();
        if (millis) {
            return setTimeout(this.resumeGame, millis);
        }
    };

    isPaused() {
        return this.playGround.isPaused();
    };

}
