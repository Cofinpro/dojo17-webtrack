/**
 * The Player class
 * - represents a player on the tileset field
 * - can be controlled by the user
 * - is synchronized to other users
 *
 */
export class Player {


    id : String;
    x:number;
    y:number;


  constructor(id: String, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
