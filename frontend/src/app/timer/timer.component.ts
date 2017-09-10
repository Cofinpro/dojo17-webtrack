import { Component, OnInit } from '@angular/core';

import { GameService } from '../services/game.service';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  public suddenDeath: boolean = false;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
      this.gameService.isSuddenDeath().subscribe(suddenDeath => {
          this.suddenDeath = suddenDeath;
      })
  }

}
