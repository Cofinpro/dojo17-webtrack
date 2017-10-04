import { Component, OnDestroy } from '@angular/core';

import { GameService } from "../services/game.service";

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss']
})

/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnDestroy {


    constructor(private gameService: GameService) { }


    ngOnDestroy(): void {
        this.gameService.destroy();
    }

}
