import { WebsocketService } from '../services/websocket.service';
import { PlayerDataService } from "../services/player-data.service";
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Bomb, NewPlayer, Player, State, FixedParts, Movement, NewBomb } from "../models";
import { PlayGround } from './playground';
import { ResourceLoader } from './resource-loader';

export class Game {

    private socketSubscription: Subscription;
    private fixedPartsSubscription: Subscription;
    private playGround: PlayGround;
    private loader: ResourceLoader = new ResourceLoader();
    private sprites = [];
    private gameLoaded = false;

    private gameIsDown: boolean = false;


    private socket: Subject<State>;
    private counterSubscription: Subscription;

    private images = {};
    private audios = {};

    private audioLoop: HTMLAudioElement;


    private counterTag;
    private livesTag;

    private player: NewPlayer;

    constructor(private websocketService: WebsocketService
        ,private playerDataService: PlayerDataService
    ) {

        this.images = this.loader.loadImages();
        this.audios = this.loader.loadAudio();

        this.socketSubscription = this.websocketService.getState().subscribe((state: State) => {
            if (this.playGround && this.playGround.isReady()) {
                this.playGround.updateState(state);
            }
        });
        this.fixedPartsSubscription = this.websocketService.getFixedParts().subscribe((fixedParts: FixedParts) => {
            if (this.playGround && this.playGround.isReady()) {
                this.playGround.paintFixedParts(fixedParts);
            }
        });
    }
    public start(): void {
        this.checkResourcesAndStart(this.loader);
    }
    public resetAudio() : void{
        const useAudio = this.playerDataService.getUseAudio();
        
        //consistent: use audio & audio is running
        if(useAudio && this.audioLoop) return;

        //want audio & not started --> start it
        if(useAudio){
            this.audioLoop = this.audios['loop'];
            this.audioLoop.loop = true;
            this.audioLoop.play();
            return;
        }

        //please!!! not that sily sound
        this.audioLoop.pause();
        this.audioLoop = null;
    }

    public resetGame(): void {
        
        if (this.audioLoop) {
            this.audioLoop.pause();
            this.audioLoop = null;
        }
        this.playGround.resetPlayGround();
        this.startGame(this.playerDataService.getPlayerName());

    }
    public getGameState(): GameState {
        if (!this.playGround) return GameState.gameLoading;

        if(this.gameLoaded && this.playGround.isGameOver()) return GameState.gameOver;

        if(this.gameLoaded) return GameState.gameRunning;

        return GameState.gameOff;
    }

    
    public isGameOver(): boolean {

        if (!this.playGround) return false;

        const gameOver = this.playGround.isGameOver();
        if (!gameOver) return false;

        if (!this.gameIsDown) {
            this.gameIsDown = true;
            this.shutDownGame();
        }
        return true;

    }
    
    private startGame(playerName: string) {

        this.player = new NewPlayer({ id: null, nickName: playerName });
        this.playGround.setPlayer(this.player);

        this.websocketService.registerPlayer(this.player);

        this.gameIsDown = false;

        if (this.playerDataService.getUseAudio()) {
            this.audioLoop = this.audios['loop'];
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
        if (this.playerDataService.getUseAudio()) {
            this.audios['lost'].play();
        }
        if (this.audioLoop) {
            this.audioLoop.pause();
            this.audioLoop = null;
        }
        document.onkeydown = null;
    }

    private checkResourcesAndStart(loader: ResourceLoader) {
        loader.resourcesLoaded().then(() => {

            const playGroundElement = document.getElementById('playground');
            playGroundElement.innerHTML = '';

            this.playGround = new PlayGround(playGroundElement, 480, 928, this.playerDataService);
            this.playGround.setImages(this.images);
            this.playGround.setAudios(this.audios);
            
            this.startGame(this.playerDataService.getPlayerName());
            this.gameLoaded = true;

        });
    }
}
export enum GameState{
    'gameOver' = 0
    ,'gameRunning' = 1
    ,'gameLoading' = 2
    ,'gameOff' = 3

}