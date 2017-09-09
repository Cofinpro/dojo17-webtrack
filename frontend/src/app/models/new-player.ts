export class NewPlayer {

    uuid: string;
    nickName: string;

    constructor(obj = {} as NewPlayer) {
        this.uuid = obj.uuid;
        this.nickName = obj.nickName;
    }

}
