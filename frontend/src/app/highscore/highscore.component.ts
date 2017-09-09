import { Component, OnInit } from '@angular/core';
import { Player} from '../models/player';
// import { GameDataService } from '';

@Component({
  selector: 'highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {

  players: Player[] = [];

  constructor() { 
    // this.players.push(new Player(1, 2, 2, 'player 1', 4, 100));
  }

  ngOnInit() {
  }

}
