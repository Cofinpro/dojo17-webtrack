import {Component, Input, OnInit, Output} from '@angular/core';
import {PlayerDataService} from "../services/player-data.service";


@Component({
  selector: 'gamestart',
  templateUrl: './gamestart.component.html',
  styleUrls: ['./gamestart.component.scss'],
  providers: [PlayerDataService]
})
export class GamestartComponent implements OnInit {
  inputPlayerName: boolean = false;

  constructor(public playerDataService: PlayerDataService) { }

  ngOnInit() {
  }

  public toggleGameStart(): void {
    if (!this.playerDataService.getPlayerName()) {
      this.inputPlayerName = true;
    }
    else {
      this.beginGame();
    }
  }

  public beginGame(): void {
    this.inputPlayerName=false;
    // TODO: call gamestart to start game und begin timer count
    console.log("tada!")
  }

}
