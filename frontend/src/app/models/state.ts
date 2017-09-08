import {Bomb} from "./bomb";
import {Player} from "./player";

export class State {
  players: Player[];
  bombs: Bomb[];
  timestamp: Date;

  static mock: State = new State([new Player("player-one",1,1)], [new Bomb("a-bomb", 4,4,"player-one", new Date())], new Date()) ;

  constructor(players: Player[], bombs: Bomb[], timestamp: Date) {
    this.players = players;
    this.bombs = bombs;
    this.timestamp = timestamp;
  }
}
