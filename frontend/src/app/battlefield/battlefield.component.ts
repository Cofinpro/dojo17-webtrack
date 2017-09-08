import { WebsocketService } from '../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import { GameStart } from './scripts/gamestart';
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

    socketSubscription: Subscription;
    public gameStart;

    constructor(private websocketService: WebsocketService) { }

    ngOnInit() {
        // start game
        this.gameStart = new GameStart();
        this.gameStart.timeCount();

        this.socketSubscription = this.websocketService
        .getObservable()
        .subscribe((message: Message) => {
            // console.log('got bombs from server', message.inMsg.bombs);
            let playGround = this.gameStart.getPlayGround();
            if (playGround) {
                playGround.updateBombs(message.inMsg.bombs);
            }
        });

    }


}
