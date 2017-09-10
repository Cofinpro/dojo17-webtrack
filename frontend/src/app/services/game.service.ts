import { HighscoreComponent } from '../highscore/highscore.component';
import { Subject, Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Game } from '../battlefield/scripts/game/game';
import { WebsocketService } from '../services/websocket.service';
import { PlayerDataService } from '../services/player-data.service';
import { Player } from '../models';

@Injectable()
export class GameService {

    private game: Game;
    private highScoreSubject: Subject<Player[]> = new Subject<Player[]>();
    private suddenDeathSubject: Subject<boolean> = new Subject<boolean>();
    private stateSubscription: Subscription;

    constructor(private websocketService: WebsocketService, private playerDataService: PlayerDataService) { }

    public startGame(): void {
        // start game
        this.game = new Game(this.websocketService, this.playerDataService);
        this.game.startTimer();

        this.stateSubscription = this.websocketService.getState().subscribe( (state) => {
            this.highScoreSubject.next(state.players);
            this.suddenDeathSubject.next(state.suddenDeath);
        });
    }

    public destroy(): void {
        this.game.socketSubscription.unsubscribe();
        this.stateSubscription.unsubscribe();
        this.websocketService.disconnect();
    }

    public isGameOver(): boolean {
        return this.game && this.game.isGameOver();
    }

    public isGameLoaded(): boolean {
        if (!this.game) {
            return true;
        }
        return this.game && this.game.isGameLoaded();
    }

    public isSuddenDeath(): Observable<boolean> {
        return this.suddenDeathSubject.asObservable();
    }

    public getPlayers(): Observable<Player[]> {
        return this.highScoreSubject.asObservable();
    }

}
