import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs/Rx';
import { Message, State, Player, Bomb } from '../models';
import { StompService } from 'ng2-stomp-service';
import { OnDestroy } from '@angular/core';

@Injectable()
export class WebsocketService implements OnDestroy{

    // This is for stomp
    private subject: Subject<State>;
    private subscription: any;
    private connected: boolean = false;

    constructor(private stomp: StompService) {

        this.subject = new Subject<State>();
        //configuration
        this.stomp.configure({
            host: 'http://192.168.75.47:3000',
            debug: true,
            queue: { 'init': false }
        });

        //start connection
        this.stomp.startConnect().then(() => {
            this.stomp.done('init');
            console.log('connected stomp');

            //subscribe
            this.subscription = this.stomp.subscribe('/topic/state', this.response);
            this.connected = true;
        });
    }

    public sendPlayer(player: Player): void {
        if (!player.id) {
            player.id = this.generateUUID();
        }
        this.send('/app/player', player);
    }

    public sendBomb(bomb: Bomb): void {
        this.send('/app/bomb', bomb);
    }

    private send(topic: string, obj: Player | Bomb) {
        if (this.connected) {
            console.log('Sending object', obj);
            this.stomp.send(topic, obj);
        } else {
            console.log("Not connected yet");
        }
    }

    private generateUUID(): string {
        return `${this.s4()}${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
    }

    private s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
    }

    //response
    public response = (state: State): State => {
        this.subject.next(state);
        console.log("Received Player", state);
        return state;
    }

    public getState(): Observable<State> {
        return this.subject.asObservable();
    }

    public getMockState(): Observable<State> {
        return Observable.interval(200).map(x => State.getMock(x));
    }

    public unsubscribe() {
        this.subscription.unsubscribe();
    }

    public disconnect() {
        //disconnect
        this.stomp.disconnect().then(() => {
            console.log('Connection closed')
        })
    }
    public ngOnDestroy(){
        this.unsubscribe();
        this.disconnect();
    }

}
