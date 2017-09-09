export class NewPlayer {

    uuid: string;
    nickName: string;

    constructor(obj = {} as NewPlayer) {
        const player: NewPlayer = new NewPlayer();
        player.uuid = obj.uuid;
        player.nickName = obj.nickName;
        return player;
    }

}
