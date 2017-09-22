import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GameService } from "../services/game.service";

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss']
})

/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnInit, OnDestroy {


    constructor(private gameService: GameService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.gameService.destroy();
    }

}
