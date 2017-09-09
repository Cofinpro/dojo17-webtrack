import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { Game } from './scripts/game/game';
import {PlayerDataService} from "../services/player-data.service";

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss'],
    providers: [WebsocketService, PlayerDataService]
})

/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnInit, OnDestroy {

    public game: Game;

    constructor(private websocketService: WebsocketService, private playerDataService: PlayerDataService) { }

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

}
