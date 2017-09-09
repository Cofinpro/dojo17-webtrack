import { Position } from './position';
import { Bomb } from "./bomb";
import { Player } from "./player";
import { Stone } from "./stone";


export class State {
    sizeX : number;
    sizeY : number;
    players: Player[];
    bombs: Bomb[];
    fixStones: Stone[];
    weakStones: Stone[];
    timestamp: Date;
    exploded : Position[];

    static readonly map: Stone[] = State.createStoneRow(0, 16, 1);

    constructor(obj = {} as State) {
        this.players = obj.players;
        this.bombs = obj.bombs;
        this.fixStones = obj.fixStones;
        this.weakStones = obj.weakStones;
        this.timestamp = obj.timestamp;
        this.sizeX = obj.sizeX;
        this.sizeY = obj.sizeY;
        this.exploded = obj.exploded;
    }

    static createStoneRow(rowIndex: number, width: number, step: number): Stone[]{
      let row : Stone[] = [];
      for(var i=0; i<width; i+=step){
        row.push(new Stone({x: i, y: rowIndex}));
      }
      return row;
    }
    static createExplodedRow(rowIndex: number, width: number, step: number): Stone[]{
      let row : Position[] = [];
      for(var i=0; i<width; i+=step){
        row.push(new Position({x: i, y: rowIndex}));
      }
      return row;
    }

    static getMock(x: number): State {
        let now: number = Date.now();

        return new State({
            players: [new Player({ id: "player-one", x: (x % 15) + 1, y: 1, nickName: "GodPlayer" })],
            bombs: [new Bomb({ id: "a-bomb", x: 3, y: 3, userId: "player-one", detonateAt: new Date(now + (5 - (x % 6)) * 1000) })],
            sizeX : 2,
            sizeY : 3,
            fixStones: State.createStoneRow(0, 16, 1),
            weakStones: [new Stone({x : 2, y: 3})],
            timestamp: new Date(now),
            exploded : State.createExplodedRow(5, 16, 1)
        });
    }

}
