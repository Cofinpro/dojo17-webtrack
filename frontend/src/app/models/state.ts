import { Bomb } from "./bomb";
import { Player } from "./player";
import { Stone } from "./stone";

export class State {
    players: Player[];
    bombs: Bomb[];
    fixStones: Stone[];
    weakStones: Stone[];
    timestamp: Date;

    constructor(obj = {} as State) {
        this.players = obj.players;
        this.bombs = obj.bombs;
        this.fixStones = obj.fixStones;
        this.weakStones = obj.weakStones;
        this.timestamp = obj.timestamp;
    }

    static getMock(x: number): State {
        let now: number = Date.now();
        return new State({
            players: [new Player({ id: "player-one", x: (x % 15) + 1, y: 1, nickName: "GodPlayer" })],
            bombs: [new Bomb({ id: "a-bomb", x: 3, y: 3, userId: "player-one", detonateAt: new Date(now + (5 - (x % 6)) * 1000) })],
            fixStones: [],
            weakStones: [new Stone({x : 2, y: 1})],
            timestamp: new Date(now)
        });
    }

}
