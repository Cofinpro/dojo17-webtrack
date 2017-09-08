import { Bomb } from "./bomb";
import { Player } from "./player";

export class State {
  players: Player[];
  bombs: Bomb[];
  timestamp: Date;

  static readonly mock: State = new State([new Player("player-one", 1, 1, "GodPlayer")], [new Bomb("a-bomb", 4, 4, "player-one", new Date())], new Date());

  constructor(players: Player[], bombs: Bomb[], timestamp: Date) {
    this.players = players;
    this.bombs = bombs;
    this.timestamp = timestamp;
  }

  static getMock(x: number): State {
    let now :number = Date.now();
    return new State([new Player("player-one", x % 15, 0, "GodPlayer")],
      [new Bomb("a-bomb", 4, 4, "player-one", new Date(now+5000))], new Date(now));
  }


}
