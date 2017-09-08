import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs/Rx';
import { Message } from '../models/message';
import { State } from '../models/state';
import { StompService } from 'ng2-stomp-service';
import { Player } from '../models/player';

@Injectable()
export class WebsocketService {

    // This is for stomp
    private subscription: any;
    private connected;

    constructor(private stomp: StompService) {
    }

    public connect(): Promise<any> {
        //configuration
        this.stomp.configure({
            host: 'http://localhost:8080',
            debug: true,
            queue: { 'init': false }
        });

        //start connection
        this.connected = this.stomp.startConnect();
        this.connected.then(() => {
            this.stomp.done('init');
            console.log('connected stomp');

            //subscribe
            this.subscription = this.stomp.subscribe('/topic/state', this.response);

        });
        return this.connected;
    }

    public sendPlayer(player: Player) {
        if (this.connected) {
            console.log("Sending player");
            this.stomp.send('/app/player', player);
        }
        else {
            console.log("Not connected yet");
        }
    }

    //response
    public response(data: any) {
        console.log("Received Player", data);
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



    private createWebSocket(): Subject<Message> {
        const socket = new WebSocket('wss://echo.websocket.org');
        const observable: Observable<any> = Observable.create(
            (observer: Observer<Message>) => {
                socket.onmessage = observer.next.bind(observer);
                socket.onerror = observer.error.bind(observer);
                socket.onclose = observer.complete.bind(observer);
                return socket.close.bind(socket);
            }
        )
        const observer = {
            next: (data: Object) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(data));
                }
            }
        }
        return Subject.create(observer, observable);
    }

    public getObservable(): Observable<Message> {
        return Observable.interval(1000).map(x => new Message(State.getMock(x), null));
        //  return this.socket;
    }



}
