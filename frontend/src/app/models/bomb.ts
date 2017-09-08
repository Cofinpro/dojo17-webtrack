/**
 * The Bomb class
 * - represents a bomb
 * - can be set by a user
 * - is synchronized to other users
 *
 */
export class Bomb {

  id: string;
  x: number;
  y: number;
  userId: string;
  detonateAt: Date;

  constructor(id: string, x: number, y:number, userId: string, detonateAt: Date){
    this.id = id;
    this.x = x;
    this.y = y;
    this.userId = userId;
    this.detonateAt = detonateAt;
  }



}
