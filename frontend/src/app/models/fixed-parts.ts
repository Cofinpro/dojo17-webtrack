import { Position } from '../shared/position';
import { Stone } from "./stone";
import { Bush } from "./bush";


export class FixedParts {
    fixStones: Stone[];
    foliage: Bush[];

    constructor(obj = {} as FixedParts) {
        this.fixStones = obj.fixStones;
        this.foliage = obj.foliage;
    }
}
