import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { Game } from './scripts/game/game';

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

    constructor(private websocketService: WebsocketService) { }

    ngOnInit() {
        // start game
        this.game = new Game(this.websocketService);
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
