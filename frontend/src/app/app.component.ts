import { Component } from '@angular/core';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PlayerDataService } from "./services/player-data.service";
import { GameService } from "./services/game.service";
import { WebsocketService } from "./services/websocket.service";
import { PreferenceService } from "./services/preference.service";
import { State } from './models/state';
import { Player } from './models/player';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ WebsocketService, PlayerDataService, GameService ]
})
export class AppComponent {
    title = 'Cofinpro Bomberman';

    constructor(public websocketService: WebsocketService
        ,public playerDataService: PlayerDataService
        ,private gameService: GameService
        ,private preferenceService: PreferenceService
    ) {
        preferenceService.setDomainPrefix('com.cofinpro.bomberman');
    }
}
