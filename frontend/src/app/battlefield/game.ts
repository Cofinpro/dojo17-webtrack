import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { PlayGround } from './playground';
import { Bomb, NewPlayer, Player, State, BattleField, Movement, NewBomb } from "../models";
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { GameResources } from './gameresources';
import { Observable } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { PlayerDataService } from "../services/player-data.service";

export class Game {
    
    private socketSubscription: Subscription;
    private battleFieldSubscription: Subscription;
    private timerSubscription: Subscription;
    private playGround: PlayGround = null;
    private resources: GameResources;
    private sprites = [];
    private gameLoaded = false;
    private timer: Observable<number>;
    private gameIsDown: boolean = false;


    private socket: Subject<State>;
    private counterSubscription: Subscription;

    private images = {};
    private audios = {};

    private audioLoop: HTMLAudioElement;


    private counterTag;
    private livesTag;

    private player: NewPlayer;

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

        this.resources.addImage('thats-me', '../../assets/images/hero/thats-me.png', 32, 32);
        
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

        //audio
        this.resources.addAudio('loop', '../../assets/audio/loop.mp3');
        this.resources.addAudio('lost', '../../assets/audio/lost.mp3');

        this.checkResources(this.resources);

        this.images = this.resources.images;
        this.audios = this.resources.audios;

        this.socketSubscription = this.websocketService.getState().subscribe((state: State) => {
            if (this.playGround && this.playGround.isReady()) {
                this.playGround.updateState(state);
            }
        });
        this.battleFieldSubscription = this.websocketService.getBattleField().subscribe((battlefield: BattleField) => {
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

            this.placeHero(this.playerDataService.getPlayerName());
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
        if(this.audioLoop){
            this.audioLoop.pause();
            this.audioLoop = null;
        }
        this.playGround.resetPlayGround();
        this.placeHero(this.playerDataService.getPlayerName());

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

    public isGameOver(): boolean {

        if(!this.playGround) return false;
        
        const gameOver = this.playGround.isGameOver();
        if(!gameOver) return false;
        
        if(!this.gameIsDown){
            this.gameIsDown = true;
            this.shutDownGame();
        }
        return true;

    }
    public isGameRunning(): boolean {
        if (!this.playGround) return false;

        return this.playGround.isGameRunning();
    }

    public startGame() {

        this.gameIsDown = false;

        if(this.playerDataService.getUseAudio()){
            this.audioLoop = this.resources.audios['loop'];
            this.audioLoop.loop = true;
            this.audioLoop.play();
        }
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

    public destroyGame() {
        this.socketSubscription.unsubscribe();
        document.onkeydown = null;
    }

    private shutDownGame() {
        if(this.playerDataService.getUseAudio()){
            this.audios['lost'].play();
        }
        if(this.audioLoop){
            this.audioLoop.pause();
            this.audioLoop = null;
        }
        document.onkeydown = null;
    }

}
