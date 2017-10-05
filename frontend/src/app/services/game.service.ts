import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { WebsocketService } from '../services/websocket.service';
import { PlayerDataService } from '../services/player-data.service';

import { Game, GameState } from '../battlefield/game';
import { Player } from '../models';

@Injectable()
export class GameService implements OnDestroy {
    private game: Game;
    private playerSubject: Subject<Player[]> = new Subject<Player[]>();
    private gameStateSubject: Subject<GameState> = new Subject<GameState>();
    private stateSubscription: Subscription;

    constructor(
        private websocketService: WebsocketService
        ,private playerDataService: PlayerDataService
    ) { }

    public startGame(): void {
       
        if (!this.game) {
            this.game = new Game(this.websocketService, this.playerDataService);
            this.game.start();
            this.stateSubscription = this.websocketService.getState().subscribe((state) => {
                this.playerSubject.next(state.players);
                this.gameStateSubject.next(this.getGameStateForService());
            });
        } else {
            //case of a restart --> reuse the old insstance
            this.game.resetGame();
        }
        this.gameStateSubject.next(this.getGameStateForService());
    }

    ngOnDestroy(): void {
        this.game.destroyGame();
        this.stateSubscription.unsubscribe();
        this.websocketService.disconnect();
    }

    public getGameState() : Observable<GameState>{
        return this.gameStateSubject.asObservable()
    }

    public getPlayers(): Observable<Player[]> {
        return this.playerSubject.asObservable();
    }

    private getGameStateForService(){
        if(!this.game) return GameState.gameOff;
        return this.game.getGameState();
    }

}
//rexport GameState to avoid circular dependencies
export { GameState };
