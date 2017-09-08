import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
