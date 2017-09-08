import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Game } from './scripts/game/game';
import { ShapeDetector } from './scripts/pixels/shapedetector';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Message } from '../models/message';

// import * as PlayGround from 'scripts/playground.js';
// import * as PlayGroundConfigurater from 'scripts/playgroundconfigurator.js';

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss']
})


/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnInit {

    public game;

    constructor(private websocketService: WebsocketService) { }

    ngOnInit() {
        // start game
        this.game = new Game(this.websocketService);
        this.game.timeCount();
    }

}
