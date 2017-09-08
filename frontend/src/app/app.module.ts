import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StompService } from 'ng2-stomp-service';

import { AppComponent } from './app.component';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { WebsocketService } from './services/websocket.service';


@NgModule({
  declarations: [
    AppComponent,
    BattlefieldComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
