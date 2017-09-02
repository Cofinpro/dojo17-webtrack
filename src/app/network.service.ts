import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

/**
* The network code for bomberman:
* Implement a SocketIO Client synchronizing the Players and the Bombs
*
* Using package ngx-socket-io
* @see: https://github.com/rodgc/ngx-socket-io
* @see: https://github.com/rodgc/ngx-socket-io/blob/master/src/socket-io.service.ts
*/
@Injectable()
export class NetworkService {

  constructor(private socket: Socket) { }

  /**
   * example implementation
   */
  sendMessage(msg: string): void {
    this.socket.emit("message", msg);
}

  /**
   * example implementation
   */
  getMessage(): Observable<any> {
    return this.socket.fromEvent("message");
  }

}
