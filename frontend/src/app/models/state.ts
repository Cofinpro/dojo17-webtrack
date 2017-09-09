import { Position } from './position';
import { Bomb } from "./bomb";
import { Player } from "./player";
import { Stone } from "./stone";
import { Bush } from "./bush";
import { BombCountPowerup } from "./bombCountPowerup";
import { BlastRadiusPowerup } from "./blastRadiusPowerup";


export class State {
    sizeX : number;
    sizeY : number;
    players: Player[];
    bombs: Bomb[];
    fixStones: Stone[];
    weakStones: Stone[];
    foliage: Bush[];
    bombCountPowerups: BombCountPowerup[];
    blastRadiusPowerups: BlastRadiusPowerup[];
    serverTime: number;
    exploded : Position[];

    static readonly map: Stone[] = State.createStoneRow(0, 16, 1);

    constructor(obj = {} as State) {
        this.players = obj.players;
        this.bombs = obj.bombs.map((bomb => new Bomb(bomb)));
        this.fixStones = obj.fixStones;
        this.weakStones = obj.weakStones;
        this.foliage = obj.foliage;
        this.bombCountPowerups = obj.bombCountPowerups;
        this.blastRadiusPowerups = obj.blastRadiusPowerups;
        this.serverTime = obj.serverTime;
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

}
