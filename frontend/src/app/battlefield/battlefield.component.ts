import { Component, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GameService } from "../services/game.service";
import { Game } from './scripts/game/game';
import { Player } from '../models';

@Component({
    selector: 'battlefield',
    templateUrl: './battlefield.component.html',
    styleUrls: ['./battlefield.component.scss']
})

/**
* The battlefields holds the 2D game logic
*/
export class BattlefieldComponent implements OnDestroy {

    public game: Game;

    constructor(private gameService: GameService) { }

    ngOnDestroy(): void {
        this.gameService.destroy();
    }

    gameLoaded() {
        return this.gameService.isGameLoaded();
    }

    gameOver() {
        return this.gameService.isGameOver();
    }

    getPlayers(): Observable<Player[]> {
        return this.gameService.getPlayers();
    }

}
