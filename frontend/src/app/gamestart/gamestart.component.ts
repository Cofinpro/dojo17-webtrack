import { Component, Input, OnInit, OnDestroy, Output, AfterViewInit } from '@angular/core';
import { PlayerDataService } from "../services/player-data.service";
import { PreferenceService } from "../services/preference.service";
import { GameService } from "../services/game.service";
import { WebsocketService } from "../services/websocket.service";

@Component({
  selector: 'gamestart',
  templateUrl: './gamestart.component.html',
  styleUrls: ['./gamestart.component.scss']
})

export class GamestartComponent implements AfterViewInit, OnInit {
    private playerName: string;
    private useAudio: boolean;

    private readonly PLAYER_NAME : string = 'player-name';
    private readonly AVATAR_ID : string = 'avatar-id';
    private readonly USE_AUDIO : string = 'use-audio';
    private playerNameFromPrefs: string = this.preferenceService.getValue(this.PLAYER_NAME);
    private avatarIdFromPrefs: string = this.preferenceService.getValue(this.AVATAR_ID);
    private useAudioFromPrefs: string = this.preferenceService.getValue(this.USE_AUDIO);
    
    
    ngOnInit(): void {
        if(this.playerNameFromPrefs){
            this.playerName = this.playerNameFromPrefs;
        }
        if(this.avatarIdFromPrefs){
            const id = Number.parseInt(this.avatarIdFromPrefs);
            this.playerDataService.setPlayerAvatarId(id);
        }
    }

    ngAfterViewInit(): void {
        //OMG! a bug known as feature!
        //to wrap the statement in setTimeOut only supresses a exception thrown in dev mode
        //in prod mode the exception is not thrown
        //plain and seriously crazy!!! 
        window.setTimeout(() =>{
            if(this.avatarIdFromPrefs){
                const selected = document.getElementById('avatar-' + this.avatarIdFromPrefs);
                selected['checked'] = 'checked';
            }
            if(this.useAudioFromPrefs){

                this.useAudio = eval(this.useAudioFromPrefs);
            }
        },0);    
    }
        
    constructor(private gameService: GameService, 
        private playerDataService: PlayerDataService, 
        private preferenceService: PreferenceService ) {}


    private manageGame(): void {

        if(!this.gameService) return;

        if(this.gameService.isGameRunning()) return;

        this.beginGame();

    }
    private beginGame() : void{
        this.playerDataService.setPlayerName(this.playerName);
        this.gameService.startGame();
    }

    private safeToPreferences() : void{
        this.preferenceService.setValue(this.PLAYER_NAME, this.playerName);
        this.preferenceService.setValue(this.AVATAR_ID, this.playerDataService.getPlayerAvatarId().toString());
        this.preferenceService.setValue(this.USE_AUDIO, String(this.useAudio));
        

    }
    private removeFromPreferences() :void{

    }

}
