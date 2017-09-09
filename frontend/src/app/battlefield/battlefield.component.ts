import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit, HostListener } from '@angular/core';

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
export class BattlefieldComponent implements OnInit {

    public game: Game;

    constructor(private websocketService: WebsocketService) { }

    ngOnInit() {
        // start game
        this.game = new Game(this.websocketService);
        this.game.startTimer();
    }
    
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
        this.game.socketSubscription.unsubscribe();
        alert('unsubscribing');
    }

}
