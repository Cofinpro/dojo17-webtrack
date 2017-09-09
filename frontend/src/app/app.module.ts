import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StompService } from 'ng2-stomp-service';

import { AppComponent } from './app.component';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { WebsocketService } from './services/websocket.service';
import { GamestartComponent } from './gamestart/gamestart.component';
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    BattlefieldComponent,
    GamestartComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [StompService],
  bootstrap: [AppComponent]
})
export class AppModule { }
