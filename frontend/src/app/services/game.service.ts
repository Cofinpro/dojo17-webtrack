import { HighscoreComponent } from '../highscore/highscore.component';
import { Subject, Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Game, GameState } from '../battlefield/game';
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
        if (!this.game) {
            this.game = new Game(this.websocketService, this.playerDataService);
            this.game.start();
            this.stateSubscription = this.websocketService.getState().subscribe((state) => {
                this.highScoreSubject.next(state.players);
                this.suddenDeathSubject.next(state.suddenDeath);
            });
        } else {
            //case of a restart --> reuse the old insstance
            this.game.resetGame();
        }
    }

    public destroy(): void {
        this.game.destroyGame();
        this.stateSubscription.unsubscribe();
        this.websocketService.disconnect();
    }

    public getGameState() : GameState{
        if(!this.game) return GameState.gameOff;

        return this.game.getGameState();
    }

    public isSuddenDeath(): Observable<boolean> {
        return this.suddenDeathSubject.asObservable();
    }

    public getPlayers(): Observable<Player[]> {
        return this.highScoreSubject.asObservable();
    }

}
//rexport GameState to avoid circular dependencies
export { GameState };
