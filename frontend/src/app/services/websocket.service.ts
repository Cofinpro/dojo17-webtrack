import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs/Rx';
import { Message } from '../models/message';

@Injectable()
export class WebsocketService {

    private socket: Subject<Message>;

    constructor() {
        this.socket = this.createWebSocket();
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
        return this.socket;
    }

    public sendMessage(message: Message) {
        this.socket.next(message);
    }

}
