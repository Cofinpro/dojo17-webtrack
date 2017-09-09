import { Injectable } from '@angular/core';

import { Game } from '../battlefield/scripts/game/game';
import { WebsocketService } from '../services/websocket.service';
import { PlayerDataService } from '../services/player-data.service';

@Injectable()
export class GameService {

    private game: Game;

    constructor(private websocketService: WebsocketService, private playerDataService: PlayerDataService) { }

    public startGame(): void {
        // start game
        this.game = new Game(this.websocketService, this.playerDataService);
        this.game.startTimer();
    }

    public destroy(): void {
        this.game.socketSubscription.unsubscribe();
        this.websocketService.disconnect();
    }

    public isGameOver(): boolean {
        return this.game && this.game.isGameOver();
    }

    public isGameLoaded(): boolean {
        if (!this.game) {
            return true;
        }
        return this.game && this.game.isGameLoaded();
    }

}
