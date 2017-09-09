import { Component, OnInit } from '@angular/core';
import {PlayerDataService} from "../services/player-data.service";

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  constructor( public playerDataService: PlayerDataService) { }

  ngOnInit() {
  }

}
