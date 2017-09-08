import { WebsocketService } from '../../../services/websocket.service';
import { PlayGround } from '../playground';
import { PlayGroundConfigurator } from '../playgroundconfigurator';
import { Direction } from '../move/direction';
import { HeroAnimator } from '../move/heroanimator';
import { ModalMessage } from '../messages/modalmessage';
import { Bomb } from "../../../models/bomb";
import { Message } from '../../../models/message';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { GameResources } from './gameresources';

export class Game {

    public game;
    public socketSubscription: Subscription;
    public playGround: PlayGround = null;
    public resources;

    direction: Direction = new Direction();

    socket: Subject<Message>;
    counterSubscription: Subscription;
    sentMessage: Message;

    images = {};
    audios = {};

    liveCount = 3;
    end = false;
    playGroundConfugurator = null;
    startedAt = null;
    hero = null;
    animator = null;

    counterTag;
    livesTag;

    constructor(private websocketService) {

        this.resources = new GameResources();

        // playground
        this.resources.addImage('burned-gras', '../../assets/images/bomberman/0.png', 32, 32);
        this.resources.addImage('gras', '../../assets/images/bomberman/1.png', 32, 32);
        this.resources.addImage('wall-light', '../../assets/images/bomberman/91.png', 32, 32);
        this.resources.addImage('wall-dark', '../../assets/images/bomberman/89.png', 32, 32);
        this.resources.addImage('box', '../../assets/images/bomberman/90.png', 32, 32);

        // heros
        this.resources.addImage('hero-1-d', '../../assets/images/hero/1/d-2.png', 32, 32);
        this.resources.addImage('hero-1-r', '../../assets/images/hero/1/r-2.png', 32, 32);
        this.resources.addImage('hero-1-l', '../../assets/images/hero/1/l-2.png', 32, 32);
        this.resources.addImage('hero-1-u', '../../assets/images/hero/1/u-2.png', 32, 32);

        this.resources.addImage('bomb3', '../../assets/images/bombs/3.png', 32, 32);
        this.resources.addImage('bomb2', '../../assets/images/bombs/2.png', 32, 32);
        this.resources.addImage('bomb1', '../../assets/images/bombs/1.png', 32, 32);
        this.resources.addImage('bomb0', '../../assets/images/bombs/0.png', 32, 32);
        this.resources.startLoading();

        this.checkResources(this.resources);

        // key event init
        document.body.onkeydown = this.checkReturn;

        this.images = this.resources.images;
        this.audios = this.resources.audios;

        // this.counterTag = document.getElementById('picks');
        // this.livesTag = document.getElementById('lives');
        this.socketSubscription = this.websocketService.getObservable().subscribe((message: Message) => {
            console.log('got server message:', message.inMsg.bombs);
            if (this.playGround) {
                console.log("playground defined");
                this.playGround.updateBombs(message.inMsg.bombs);
                // this.playGround.updatePlayer(message.inMsg.players);
            }
        });
    }

    checkResources(resources) {
        console.log('called');
        resources.resourcesLoaded().then( () => {

            console.log("promised sonsumed");
            var playGroundElement = document.getElementById('playground');
            playGroundElement.innerHTML = '';
            // this.counterTag.innerHTML = '';

            this.playGround = new PlayGround(playGroundElement, 544, 544);

            this.playGround.setPickItUpCallBack(this.picked);
            this.playGround.setTargetCaughtCallBack(this.caught);

            this.playGroundConfugurator = new PlayGroundConfigurator(this.playGround, this.images);
            this.playGroundConfugurator.configure();

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
            //this.placeCockpit();
        });

    }

    checkReturn(e) {
        var event = window.event ? window.event : e;
        var keyCode = event.keyCode;
        if (keyCode == 80) {
            if (this.isPaused()) {
                this.resumeGame();
            } else {
                this.pauseGame(1000);
            }
        }
        if(event.altKey & event.ctrlKey && keyCode == 71){
            this.playGround.shieldTarget(this.hero, -1);
        }
    }

    // FIXME: not working right now
    timeCount() {
        let timeElement = document.getElementById('time');
        timeElement.innerHTML = '00:00:00'

        if (this.end) {
            return;
        }

        if (!this.startedAt) {
            this.startedAt = Date.now();
        }

        var elapsed = Date.now() - this.startedAt;
        var centies = Math.ceil(elapsed / 10);
        var minutes = Math.floor(centies / 6000);
        var rest = centies % 6000;
        var secs = Math.floor(rest / 100);
        rest = rest % 100;

        timeElement.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + secs).slice(-2) + ':' + ('00' + rest).slice(-2);

        return window.setTimeout(this.timeCount, 50, timeElement);
    }

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
       this.playGround.bombs.push(new Bomb(null, x, y, null, null));
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

    startGame() {
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

        this.audios['loop'].loop = true;
        this.audios['loop'].volume = 0.8;
        this.audios['loop'].play();

        this.animator.start();
        // this.playGround.startMovers();
        //this.playGround.shieldTarget(this.hero, 2000);
        this.startedAt = null;
        this.end = false;
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

    getPlayGround() {
        return this.playGround;
    }

}
