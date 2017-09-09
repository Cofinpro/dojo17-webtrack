import { Component, Input, OnInit, Output } from '@angular/core';
import { PlayerDataService } from "../services/player-data.service";
import { GameService } from "../services/game.service";
import { WebsocketService } from "../services/websocket.service";


@Component({
  selector: 'gamestart',
  templateUrl: './gamestart.component.html',
  styleUrls: ['./gamestart.component.scss']
})

export class GamestartComponent implements OnInit {
    inputPlayerName: boolean = false;

    playerName: string;

    constructor(private gameService: GameService, private playerDataService: PlayerDataService) { }

    ngOnInit() {
    }

    public toggleGameStart(): void {
        if (!this.playerDataService.getPlayerName()) {
            this.inputPlayerName = true;
        } else {
            this.beginGame();
        }
    }

    public beginGame(): void {
        this.inputPlayerName = false;
        this.playerDataService.setPlayerName(this.playerName);
        this.gameService.startGame();
    }

}
