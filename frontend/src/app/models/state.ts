import {Bomb} from "./bomb";
import {Player} from "./player";

export class State {
  players: Player[];
  bombs: Bomb[];
  timestamp: Date;


  constructor(players: [], bombs: Bomb[], timestamp: Date) {
    this.players = players;
    this.bombs = bombs;
    this.timestamp = timestamp;
  }
}
