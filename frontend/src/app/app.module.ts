import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StompService } from 'ng2-stomp-service';

import { AppComponent } from './app.component';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { WebsocketService } from './services/websocket.service';
import { GamestartComponent } from './gamestart/gamestart.component';
import { FormsModule } from "@angular/forms";
import { HighscoreComponent } from './highscore/highscore.component';
import { TimerComponent } from './timer/timer.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferenceService } from './services/preference.service';


@NgModule({
  declarations: [
    AppComponent,
    BattlefieldComponent,
    GamestartComponent,
    HighscoreComponent,
    TimerComponent,
    PreferencesComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [StompService, PreferenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
