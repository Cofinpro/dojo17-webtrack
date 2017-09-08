import { Bomb } from "./bomb";
import { Player } from "./player";

export class State {
  players: Player[];
  bombs: Bomb[];
  timestamp: Date;

  static readonly mock: State = new State([new Player({ id: "player-one", x: 1, y: 1, nickName: "GodPlayer" })], [new Bomb("a-bomb", 4, 4, "player-one", new Date())], new Date());

  constructor(players: Player[], bombs: Bomb[], timestamp: Date) {
    this.players = players;
    this.bombs = bombs;
    this.timestamp = timestamp;
  }

  static getMock(x: number): State {
    let now: number = Date.now();
    return new State([new Player({ id: "player-one", x: (x % 15) + 1, y: 1, nickName: "GodPlayer" })],
      [new Bomb("a-bomb", 3, 3, "player-one", new Date(now + (5 - (x % 6)) * 1000))], new Date(now));
  }

}
