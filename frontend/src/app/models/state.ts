import { Bomb } from "./bomb";
import { Player } from "./player";

export class State {
    sizeX : number;
    sizeY : number;
    players: Player[];
    bombs: Bomb[];
    timestamp: Date;



    constructor(obj = {} as State) {
        this.players = obj.players;
        this.bombs = obj.bombs;
        this.timestamp = obj.timestamp;
        this.sizeX = obj.sizeX;
        this.sizeY = obj.sizeY;
    }

    static getMock(x: number): State {
        let now: number = Date.now();
        return new State({ 
            players: [new Player({ id: "player-one", x: (x % 15) + 1, y: 1, nickName: "GodPlayer" })],
            bombs: [new Bomb({ id: "a-bomb", x: 3, y: 3, userId: "player-one", detonateAt: new Date(now + (5 - (x % 6)) * 1000) })],
            timestamp: new Date(now),
            sizeX : 2,
            sizeY : 3
        });
    }

}
