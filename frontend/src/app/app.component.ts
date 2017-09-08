import { Component, OnInit } from '@angular/core';
import { Subscription, Observer, Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Message } from './models/message';
import { WebsocketService } from './services/websocket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ WebsocketService ]
})
export class AppComponent implements OnInit {
    title = 'Cofinpro Bomberman';

    socket: Subject<Message>;
    counterSubscription: Subscription;
    socketSubscription: Subscription;
    sentMessage: Message;

    constructor(private websocketService: WebsocketService) {
    }

    ngOnInit() {
        this.socketSubscription = this.websocketService
                .getObservable()
                .subscribe((message: any) => {
            message = Message.factory(JSON.parse(message.data));
            console.log(message.text);
        });
        this.launchCounter();
    }

    private launchCounter() {
      if (this.counterSubscription) {
          this.counterSubscription.unsubscribe();
      }
      let counter = Observable.interval(1000);
      this.counterSubscription = counter.subscribe(
          num => {
              this.sentMessage = new Message('Websocket Message '+ num);
              this.websocketService.sendMessage(this.sentMessage);
          });
    }

}
