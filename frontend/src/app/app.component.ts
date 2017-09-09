import { Component } from '@angular/core';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { State } from './models/state';
import { Player } from './models/player';
import {PlayerDataService} from "./services/player-data.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [PlayerDataService]
})
export class AppComponent {
    title = 'Cofinpro Bomberman';
}
