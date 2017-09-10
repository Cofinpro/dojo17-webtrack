import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { GameService } from '../services/game.service';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  public suddenDeath: boolean = false;
  private subscription: Subscription;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
      this.subscription = this.gameService.isSuddenDeath().subscribe(suddenDeath => {
          this.suddenDeath = suddenDeath;
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
