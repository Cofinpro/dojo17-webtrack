/**
 * The Player class
 * - represents a player on the tileset field
 * - can be controlled by the user
 * - is synchronized to other users
 *
 */
export class Player {


    id : string;
    x: number;
    y: number;
    nickname: string;


  constructor(id: string, x: number, y: number, nickname: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.nickname = nickname;
  }
}
