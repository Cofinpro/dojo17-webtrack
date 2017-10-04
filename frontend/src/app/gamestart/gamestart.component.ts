import { Component, Input, OnInit, OnDestroy, Output, AfterViewInit } from '@angular/core';
import { PlayerDataService } from "../services/player-data.service";
import { PreferenceService } from "../services/preference.service";
import { GameService, GameState } from "../services/game.service";
import { Subject, Subscription } from 'rxjs/Rx';
import { WebsocketService } from "../services/websocket.service";

@Component({
    selector: 'gamestart',
    templateUrl: './gamestart.component.html',
    styleUrls: ['./gamestart.component.scss']
})

export class GamestartComponent implements AfterViewInit, OnInit {
    //for use in the view
    private gameState = GameState;

    private currentGameState : GameState = GameState.gameOff;

    private playerName: string;
    private useAudio: boolean;
    private avatarId: number = 1;

    private readonly PLAYER_NAME: string = 'player-name';
    private readonly AVATAR_ID: string = 'avatar-id';
    private readonly USE_AUDIO: string = 'use-audio';
    
    private playerNameFromPrefs: string = this.preferenceService.getValue(this.PLAYER_NAME);
    private avatarIdFromPrefs: string = this.preferenceService.getValue(this.AVATAR_ID);
    private useAudioFromPrefs: string = this.preferenceService.getValue(this.USE_AUDIO);

    private gameStateSubscription: Subscription;


    ngOnInit(): void {
        if (this.playerNameFromPrefs) {
            this.playerName = this.playerNameFromPrefs;
        }
        if (this.avatarIdFromPrefs) {
            const id = Number.parseInt(this.avatarIdFromPrefs);
            this.avatarId = id;
        }
        if (this.useAudioFromPrefs) {
            this.useAudio = eval(this.useAudioFromPrefs);
        }

        this.gameStateSubscription = this.gameService.getGameState().subscribe((gameState) =>{
            this.currentGameState = gameState;
        });
    }

    ngAfterViewInit(): void {
        //OMG! a bug known as feature!
        //to wrap the statement in setTimeOut only supresses a exception thrown in dev mode
        //in prod mode the exception is not thrown
        //plain and seriously crazy!!! 
        window.setTimeout(() => {
            if (this.avatarIdFromPrefs) {
                const selected = document.getElementById('avatar-' + this.avatarIdFromPrefs);
                selected['checked'] = 'checked';
            }
        });
    }

    constructor(private gameService: GameService,
        private playerDataService: PlayerDataService,
        private preferenceService: PreferenceService) { }


    private manageGame(): void {

        if (!this.gameService) return;

        // if(this.gameService.getGameState() === GameState.gameRunning) return;

        this.beginGame();

    }
    private beginGame(): void {
        this.playerDataService.setPlayerName(this.playerName);
        this.playerDataService.setUseAudio(this.useAudio);
        this.playerDataService.setPlayerAvatarId(this.avatarId);
        this.gameService.startGame();
    }

    private safeToPreferences(): void {
        this.preferenceService.setValue(this.PLAYER_NAME, this.playerName);
        this.preferenceService.setValue(this.AVATAR_ID, String(this.avatarId));
        this.preferenceService.setValue(this.USE_AUDIO, String(this.useAudio));


    }
    private removeFromPreferences(): void {
        this.preferenceService.removeValue(this.PLAYER_NAME);
        this.preferenceService.removeValue(this.AVATAR_ID);
        this.preferenceService.removeValue(this.USE_AUDIO);
    }

}
