import { Injectable } from '@angular/core';
import { Subscription, Subject, Observable, Observer } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { State, FixedParts, Player, Bomb, Movement, NewPlayer, NewBomb } from '../models';
import { StompService } from 'ng2-stomp-service';
import { OnDestroy } from '@angular/core';

@Injectable()
export class WebsocketService implements OnDestroy{

    // This is for stomp
    private subject: Subject<State>;
    private battleFieldSubject: Subject<FixedParts>;
    private subscription: Subscription;
    private battleFieldSubscription : Subscription;
    private connected: boolean = false;

    constructor(private stomp: StompService) {

        this.subject = new Subject<State>();
        this.battleFieldSubject = new Subject<FixedParts>();
        //configuration
        this.stomp.configure({
            // host: 'http://192.168.178.39:8080',
            host: 'http://localhost:8080',
            debug: false,
            queue: { 'init': false }
        });

        //start connection
        this.stomp.startConnect().then(() => {
            this.stomp.done('init');
            console.log('connected stomp');

            //subscribe
            this.subscription = this.stomp.subscribe('/topic/state', this.response);
            this.battleFieldSubscription = this.stomp.subscribe('/topic/battlefield', this.battleFieldResponse);
            this.connected = true;
        });
    }

    public registerPlayer(player: NewPlayer): void {
        if (!player.id) {
            player.id = this.generateUUID();
        }
        this.send('/app/register', player);
    }

    public sendMovement(movement: Movement): void {
        this.send('/app/move', movement);
    }

    public sendBomb(bomb: NewBomb): void {
        this.send('/app/bomb', bomb);
    }

    private send(topic: string, obj: NewPlayer | string | Movement) {
        if (this.connected) {
            console.log('Sending object', obj);
            this.stomp.send(topic, obj);
        } else {
            console.log('Not connected yet');
        }
    }

    private generateUUID(): string {
        return `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
    }

    private s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
    }

    public response = (state: State): State => {
        this.subject.next(state);
        return state;
    }
    public battleFieldResponse = (battlefield: FixedParts): FixedParts => {
        this.battleFieldSubject.next(battlefield);
        return battlefield;
    }

    public getState(): Observable<State> {
        return this.subject.asObservable().map((state) => new State(state));
    }
    public getFixedParts(): Observable<FixedParts> {
        return this.battleFieldSubject.asObservable().map((battlefield) => new FixedParts(battlefield));
    }

    public disconnect() {
        this.subscription.unsubscribe();
        this.battleFieldSubscription.unsubscribe();
        this.stomp.disconnect().then(() => {
            console.log('Connection closed');
        });
    }

    public ngOnDestroy() {
        this.disconnect();
    }

}
