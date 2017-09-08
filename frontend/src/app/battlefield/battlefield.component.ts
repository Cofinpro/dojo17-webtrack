import { Component, OnInit } from '@angular/core';
import { ShapeDetector } from './scripts/pixels/shapedetector.js';
import { GameResources } from './scripts/game/gameresources.js';

// import * as PlayGround from 'scripts/playground.js';
// import * as PlayGroundConfigurater from 'scripts/playgroundconfigurator.js';

@Component({
  selector: 'battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss']
})


/**
 * The battlefields holds the 2D game logic
 */
export class BattlefieldComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var resources = new GameResources();



    var t = new Test();
    t.setup();
  }


}
