import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Game } from './scripts/game/game';
import { Player } from '../models/player';
import { PlayerDataService } from "../services/player-data.service";

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss'],
    providers: [WebsocketService]
})

/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnInit, OnDestroy {

    public game: Game;

    constructor(private websocketService: WebsocketService, public playerDataService: PlayerDataService) { }

    ngOnInit() {
        // start game
        this.game = new Game(this.websocketService, this.playerDataService);
        this.game.startTimer();
    }

    ngOnDestroy(): void {
        this.game.socketSubscription.unsubscribe();
        this.websocketService.disconnect();
    }

    gameLoaded() {
        return this.game && this.game.isGameLoaded();
    }

    gameOver() {
        return this.game && this.game.isGameOver();
    }

    getPlayers(): Player[] {
        if (this.game) {
            return this.game.getPlayers();
        }
        return [];
    }

}
