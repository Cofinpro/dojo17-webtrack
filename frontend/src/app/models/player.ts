/**
 * The Player class
 * - represents a player on the tileset field
 * - can be controlled by the user
 * - is synchronized to other users
 *
 */
export class Player {
  id: string;
  x: number;
  y: number;
  nickName: string;
  blastRadius: number;

  constructor(obj = {} as Player) {
    this.id = obj.id;
    this.x = obj.x;
    this.y = obj.y;
    this.nickName = obj.nickName;
    this.blastRadius = obj.blastRadius;
  }
}
