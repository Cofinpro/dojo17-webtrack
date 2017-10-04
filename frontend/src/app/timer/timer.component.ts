import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs";
import { GameService, GameState } from '../services/game.service';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnDestroy, AfterViewInit {
  private timer: Observable<number>;
  private timerSubscription: Subscription;

  private gameStateSubscription: Subscription;
  private running : boolean = false;

  private timeElement : HTMLElement;

  constructor(private gameService: GameService) {
    this.gameStateSubscription = this.gameService.getGameState().subscribe((gameState) => {
      if (gameState === GameState.gameOver) this.stopTimer();
      if (gameState === GameState.gameRunning) this.startTimer();
    });

  }

  ngAfterViewInit(): void {
    this.timeElement = document.getElementById('time');
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  private stopTimer(): void {
    this.timerSubscription.unsubscribe();
    this.timer = null;
    this.timeElement.innerHTML = 'done!';
      
    this.running = false;
  }
  private startTimer(): void {

    if(this.running) return;

    this.running = true;

    this.timer = TimerObservable.create(0, 10);
    this.timerSubscription = this.timer.subscribe(t => {
      const minutes = Math.floor(t / 6000) % 60;
      const seconds = Math.floor(t / 100) % 60;
      const rest = t;
      this.timeElement.innerHTML = ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
    });
    
  }
}