import { Component, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { PlayerDataService } from "../services/player-data.service";
import { GameService } from "../services/game.service";
import { WebsocketService } from "../services/websocket.service";

@Component({
  selector: 'gamestart',
  templateUrl: './gamestart.component.html',
  styleUrls: ['./gamestart.component.scss']
})

export class GamestartComponent {
    private running : boolean  = false;
    playerName: string;
    
    constructor(public gameService: GameService, public playerDataService: PlayerDataService) {}

    private manageGame(): void {

        if(!this.gameService) return;

        if(this.gameService.isGameRunning()) return;

        this.beginGame();

    }
    private beginGame() : void{
        this.playerDataService.setPlayerName(this.playerName);
        this.gameService.startGame();
    }

}
