export class NewPlayer {

    id: string;
    nickName: string;

    constructor(obj = {} as NewPlayer) {
        this.id = obj.id;
        this.nickName = obj.nickName;
    }

}
