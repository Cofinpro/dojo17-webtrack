import { Position } from '../shared/position';
import { Stone } from "./stone";
import { Bush } from "./bush";


export class BattleField {
    fixStones: Stone[];
    foliage: Bush[];
    serverTime: number;

    constructor(obj = {} as BattleField) {
        this.fixStones = obj.fixStones;
        this.foliage = obj.foliage;
        this.serverTime = obj.serverTime;
    }


}
