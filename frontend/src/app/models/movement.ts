export class Movement {

    playerId: string;
    direction: string;

    constructor(obj = {} as Movement) {
        this.playerId = obj.playerId;
        this.direction = obj.direction;
    }
}