import { Position } from './position';
import { Stone } from "./stone";
import { Bush } from "./bush";


export class BattleField {
    fixStones: Stone[];
    foliage: Bush[];
    serverTime: number;
    exploded : Position[];
    suddenDeath : boolean;

    static readonly map: Stone[] = BattleField.createStoneRow(0, 16, 1);

    constructor(obj = {} as BattleField) {
        this.fixStones = obj.fixStones;
        this.foliage = obj.foliage;
        this.serverTime = obj.serverTime;
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
