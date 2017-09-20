import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { PlayGround } from '../battlefield/playground';
import { Bomb, NewPlayer, Player, State, BattleField, Movement, NewBomb } from "../models";
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { GameResources } from './gameresources';
import { Observable } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { PlayerDataService } from "../services/player-data.service";

export class Game {

    public game;
    public socketSubscription: Subscription;
    public initialSubscription: Subscription;
    public timerSubscription: Subscription;
    public playGround: PlayGround = null;
    public resources: GameResources;
    public sprites = [];
    public gameLoaded = false;
    private timer: Observable<number>;


    socket: Subject<State>;
    counterSubscription: Subscription;

    images = {};
    audios = {};


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

        // powerups
        this.resources.addImage('powerupBlue', '../../assets/images/powerups/powerupBlue.png', 32, 32);
        this.resources.addImage('powerupRed', '../../assets/images/powerups/powerupRed.png', 32, 32);

        // misc
        this.resources.addImage('bush', '../../assets/images/misc/bush.png', 32, 32);

        this.checkResources(this.resources);

        this.images = this.resources.images;
        this.audios = this.resources.audios;

        this.socketSubscription = this.websocketService.getState().subscribe((state: State) => {
            if (this.playGround && this.playGround.isReady()) {
                this.playGround.updateState(state);
            }
        });
        this.initialSubscription = this.websocketService.getBattleField().subscribe((battlefield: BattleField) => {
            if (this.playGround && this.playGround.isReady()) {
                this.playGround.paintBattleField(battlefield);
            }
        });
    }

    checkResources(resources: GameResources) {
        resources.resourcesLoaded().then(() => {


            const playGroundElement = document.getElementById('playground');
            playGroundElement.innerHTML = '';

            this.playGround = new PlayGround(playGroundElement, 480, 928, this.playerDataService);
            this.playGround.setResources(resources);

            this.gameLoaded = true;
        });
    }

    isGameLoaded() {
        return this.gameLoaded;
    }
    resetGame() {
        if (this.timer) {
            this.timerSubscription.unsubscribe();
            this.timer = null;
        }
        this.playGround.resetPlayGround();

    }

    startTimer(): void {

        this.timer = TimerObservable.create(0, 10);
        this.timerSubscription = this.timer.subscribe(t => {
            const minutes = Math.floor(t / 6000) % 60;
            const seconds = Math.floor(t / 100) % 60;
            const rest = t;
            const timeElement = document.getElementById('time');
            timeElement.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
        });
    }
    // stopTimer(): void {
    //     this.timer.
    // }

    placeHero(playerName: string) {
        this.player = new NewPlayer({ id: null, nickName: playerName });
        this.playGround.setPlayer(this.player);

        this.websocketService.registerPlayer(this.player);
        this.startGame();
    }

    getPlayers(): Player[] {
        if (this.playGround) {
            return this.playGround.players;
        }
        return [];
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
    public isGameRunning(): boolean {
        if (!this.playGround) return false;

        return this.playGround.isGameRunning();
    }

    startGame() {
        document.onkeydown = (e) => {
            let event: any = window.event ? window.event : e;
            let keyCode = event.keyCode;
            let dir;
            const movement: Movement = new Movement({ playerId: this.player.id });

            switch (keyCode) {
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
    }

    shutDownGame() {
        document.onkeydown = null;
    }


    getPlayGround() {
        return this.playGround;
    }

}
