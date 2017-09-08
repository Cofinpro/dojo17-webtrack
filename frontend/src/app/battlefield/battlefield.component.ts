import { Component, OnInit } from '@angular/core';
import { GameStart } from './scripts/gamestart';
import { ShapeDetector } from './scripts/pixels/shapedetector';

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
        let game = new GameStart();
        game.timeCount();
    }


}
