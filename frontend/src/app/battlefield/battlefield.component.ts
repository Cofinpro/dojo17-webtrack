import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, HostListener } from '@angular/core';

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
export class BattlefieldComponent implements OnInit {

    public game: Game;

    constructor(private websocketService: WebsocketService) { }

    ngOnInit() {
        // start game
        this.game = new Game(this.websocketService);
        this.game.startTimer();
    }

    gameLoaded() {
        return this.game && this.game.isGameLoaded();
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
        this.game.socketSubscription.unsubscribe();
        console.log('unsubscribing');
    }

}
