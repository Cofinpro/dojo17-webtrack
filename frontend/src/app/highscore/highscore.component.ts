import { Component, OnInit } from '@angular/core';
import { Player} from '../models/player';
import { GameService } from '../services/game.service';

@Component({
  selector: 'highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit {

  players: Player[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getPlayers().subscribe( (players) => {
      this.players = players;
    });
  }

}
