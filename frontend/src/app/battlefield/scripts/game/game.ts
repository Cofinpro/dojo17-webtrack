import { WebsocketService } from '../../../services/websocket.service';
import { PlayGround } from '../playground';
import { Direction } from '../move/direction';
import { HeroAnimator } from '../move/heroanimator';
import { ModalMessage } from '../messages/modalmessage';
import { Bomb, NewPlayer, Player, State, Movement, NewBomb } from "../../../models";
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { GameResources } from './gameresources';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {PlayerDataService} from "../../../services/player-data.service";

export class Game {

    public game;
    public socketSubscription: Subscription;
    public timerSubscription: Subscription;
    public playGround: PlayGround = null;
    public resources;
    public sprites = [];
    public gameLoaded = false;

    direction: Direction = new Direction();

    socket: Subject<State>;
    counterSubscription: Subscription;

    images = {};
    audios = {};

    liveCount = 3;
    end = false;
    startedAt = null;
    hero = null;
    animator: HeroAnimator = null;

    counterTag;
    livesTag;

    player: NewPlayer;

    constructor(private websocketService: WebsocketService, private playerDataService: PlayerDataService) {

        this.resources = new GameResources();

        // playground
        this.resources.addImage('burned-gras', '../../assets/images/bomberman/0.png', 32, 32);
        this.resources.addImage('gras', '../../assets/images/bomberman/1.png', 32, 32);
        this.resources.addImage('wall-light', '../../assets/images/bomberman/91.png', 32, 32);
        this.resources.addImage('wall-dark', '../../assets/images/bomberman/89.png', 32, 32);
        this.resources.addImage('box', '../../assets/images/bomberman/90.png', 32, 32);

        // heroes
        this.resources.addImage('hero-1-d', '../../assets/images/hero/1/d-2.png', 32, 32);
        this.resources.addImage('hero-1-r', '../../assets/images/hero/1/r-2.png', 32, 32);
        this.resources.addImage('hero-1-l', '../../assets/images/hero/1/l-2.png', 32, 32);
        this.resources.addImage('hero-1-u', '../../assets/images/hero/1/u-2.png', 32, 32);
        this.resources.addImage('hero-2-d', '../../assets/images/hero/2/d-2.png', 32, 32);
        this.resources.addImage('hero-2-r', '../../assets/images/hero/2/r-2.png', 32, 32);
        this.resources.addImage('hero-2-l', '../../assets/images/hero/2/l-2.png', 32, 32);
        this.resources.addImage('hero-2-u', '../../assets/images/hero/2/u-2.png', 32, 32);
        this.resources.addImage('hero-3-d', '../../assets/images/hero/3/d-2.png', 32, 32);
        this.resources.addImage('hero-3-r', '../../assets/images/hero/3/r-2.png', 32, 32);
        this.resources.addImage('hero-3-l', '../../assets/images/hero/3/l-2.png', 32, 32);
        this.resources.addImage('hero-3-u', '../../assets/images/hero/3/u-2.png', 32, 32);
        this.resources.addImage('hero-4-d', '../../assets/images/hero/4/d-2.png', 32, 32);
        this.resources.addImage('hero-4-r', '../../assets/images/hero/4/r-2.png', 32, 32);
        this.resources.addImage('hero-4-l', '../../assets/images/hero/4/l-2.png', 32, 32);
        this.resources.addImage('hero-4-u', '../../assets/images/hero/4/u-2.png', 32, 32);
        this.resources.addImage('hero-5-d', '../../assets/images/hero/5/d-2.png', 32, 32);
        this.resources.addImage('hero-5-r', '../../assets/images/hero/5/r-2.png', 32, 32);
        this.resources.addImage('hero-5-l', '../../assets/images/hero/5/l-2.png', 32, 32);
        this.resources.addImage('hero-5-u', '../../assets/images/hero/5/u-2.png', 32, 32);
        this.resources.addImage('hero-6-d', '../../assets/images/hero/6/d-2.png', 32, 32);
        this.resources.addImage('hero-6-r', '../../assets/images/hero/6/r-2.png', 32, 32);
        this.resources.addImage('hero-6-l', '../../assets/images/hero/6/l-2.png', 32, 32);
        this.resources.addImage('hero-6-u', '../../assets/images/hero/6/u-2.png', 32, 32);
        this.resources.addImage('hero-7-d', '../../assets/images/hero/7/d-2.png', 32, 32);
        this.resources.addImage('hero-7-r', '../../assets/images/hero/7/r-2.png', 32, 32);
        this.resources.addImage('hero-7-l', '../../assets/images/hero/7/l-2.png', 32, 32);
        this.resources.addImage('hero-7-u', '../../assets/images/hero/7/u-2.png', 32, 32);
        this.resources.addImage('hero-8-d', '../../assets/images/hero/8/d-2.png', 32, 32);
        this.resources.addImage('hero-8-r', '../../assets/images/hero/8/r-2.png', 32, 32);
        this.resources.addImage('hero-8-l', '../../assets/images/hero/8/l-2.png', 32, 32);
        this.resources.addImage('hero-8-u', '../../assets/images/hero/8/u-2.png', 32, 32);

        // bombs
        this.resources.addImage('bomb5', '../../assets/images/bombs/5.png', 32, 32);
        this.resources.addImage('bomb4', '../../assets/images/bombs/4.png', 32, 32);
        this.resources.addImage('bomb3', '../../assets/images/bombs/3.png', 32, 32);
        this.resources.addImage('bomb2', '../../assets/images/bombs/2.png', 32, 32);
        this.resources.addImage('bomb1', '../../assets/images/bombs/1.png', 32, 32);
        this.resources.addImage('bomb0', '../../assets/images/bombs/0.png', 32, 32);

        // explosions
        this.resources.addImage('explosionFullCenter', '../../assets/images/explosion/explosionFullCenter.png', 32, 32);

        this.resources.startLoading();

        this.checkResources(this.resources);

        // key event init
        document.body.onkeydown = this.checkReturn;

        this.images = this.resources.images;
        this.audios = this.resources.audios;

        // this.counterTag = document.getElementById('picks');
        // this.livesTag = document.getElementById('lives');
        this.socketSubscription = this.websocketService.getState().subscribe((state: State) => {
            console.log('got server message:', state.bombs);
            if (this.playGround && this.playGround.resources) {
                this.playGround.updateState(state);
            }
        });

    }

    checkResources(resources) {
        console.log('called');
        resources.resourcesLoaded().then( () => {

            console.log('Game has successfully loaded!');

            const playGroundElement = document.getElementById('playground');
            playGroundElement.innerHTML = '';
            // this.counterTag.innerHTML = '';

            this.playGround = new PlayGround(playGroundElement, 544, 544);
            this.playGround.resources = this.resources;

            this.playGround.setPickItUpCallBack(this.picked);
            this.playGround.setTargetCaughtCallBack(this.caught);
            this.placeHero();

            this.gameLoaded = true;
        });
    }

    isGameLoaded() {
        return this.gameLoaded;
    }

    checkReturn(e) {
        let event = window.event ? window.event : e;
        let keyCode = event.keyCode;
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

    startTimer(): void {
      let timer = TimerObservable.create(0, 10);
      this.timerSubscription = timer.subscribe(t => {
       let minutes = Math.floor(t/6000) % 60;
       let seconds = Math.floor(t/100) % 60;
       let rest = t;


        let timeElement = document.getElementById('time');
        timeElement.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2) ;//+ ':' +  ('00' +
        // rest).slice(-2);

      });
    }

    placeHero() {
        this.playGround.removeGameElement(this.hero);
/*
        let heroImages = {};
        heroImages['up'] = this.images['hero-1-u'];
        heroImages['down'] = this.images['hero-1-d'];
        heroImages['left'] = this.images['hero-1-l'];
        heroImages['right'] = this.images['hero-1-r'];

        this.hero = this.playGround.createPicture(null, 32, 32, heroImages['right']);
*/
        this.player  = new NewPlayer({ id: null, nickName: 'Player 1' });
        this.playGround.setPlayer(this.player);

        this.websocketService.registerPlayer(this.player);
        //this.animator = new HeroAnimator(this.hero, this.playGround, this.websocketService, this.player);
       // this.animator.setImages(heroImages);
        //this.playGround.addTarget(this.hero);
        this.startGame();
    }

    isGameOver(): boolean {
        if (this.playGround) {
            if (this.playGround.isGameOver()) {
                this.shutDownGame();
            }
            return this.playGround.isGameOver();
        }
        return false;
    }

    // FIXME:
    // public placeBomb(x: number, y: number): void {
    //     this.sprites.push(this.playGround.createPicture(y * 32, x * 32, this.images['bomb3']));
    //    this.playGround.bombs.push(new Bomb(null, x, y, null, null));
    // }

    picked(pickItUps) {

        if (pickItUps.length === 0) {
            return;
        }

        let i;
        for(i = 0; i < pickItUps.length; i++){
            let pickItUp = pickItUps[i];
            let top = pickItUp.top;
            let left = pickItUp.left;

            this.playGround.removeGameElement(pickItUp);

            let finished = this.playGround.getPickItUps().length == 0;

            let im = new Image();
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

        let current = this.livesTag.childElementCount;
        this.livesTag.removeChild(this.livesTag.firstElementChild);
        let next = current - 1;
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

    startGame() {
        document.onkeydown = (e) => {
            let event: any = window.event ? window.event : e;
            let keyCode = event.keyCode;
            let dir;

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
                    break;
            }
            //this.animator.addToActiveDirections(dir);
        };

        document.onkeyup = (e) => {
            let event: any = window.event ? window.event : e;
            let keyCode = event.keyCode;
            let dir;
            let posUpdated = false;
            const movement: Movement = new Movement({ playerId: this.player.id });
            switch(keyCode){
                case 37:
                    movement.direction = 'L';
                    break;
                case 39:
                    movement.direction = 'R';
                    break;
                case 38:
                    movement.direction = 'U';
                    break;
                case 40:
                    movement.direction = 'D';
                    break;
                case 32:
                    this.websocketService.sendBomb(new NewBomb({ playerId: this.player.id }));
                    break;
            }
            if (movement.direction) {
                this.websocketService.sendMovement(movement);
            }
        };

        this.startedAt = null;
        this.end = false;
    }

    shutDownGame() {
        this.end = true;
        this.audios['loop'].load();
        this.playGround.stopMovers();
        document.onkeydown = null;
        document.onkeyup = null;
        this.animator.stop();
        this.animator = null;
    }

    resumeGame() {
        this.playGround.endPause();
    }

    pauseGame(millis) {
        this.playGround.pause();
        if (millis) {
            return setTimeout(this.resumeGame, millis);
        }
    }

    isPaused() {
        return this.playGround.isPaused();
    }

    getPlayGround() {
        return this.playGround;
    }

}
