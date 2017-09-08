import { Component, OnInit } from '@angular/core';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { WebsocketService } from './services/websocket.service';
import { State } from './models/state';
import { Player } from './models/player';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [WebsocketService]
})
export class AppComponent implements OnInit {
    title = 'Cofinpro Bomberman';

    constructor(private websocketService: WebsocketService) {
    }

    ngOnInit() {
        const player: Player = new Player({ id: "12", x: 0, y: 0, nickName: "Der Player" });
        this.websocketService.connect().then(() => {
            this.websocketService.sendPlayer(player);
            //this.websocketService.unsubscribe();

           // this.websocketService.disconnect();
        })

    }


}
