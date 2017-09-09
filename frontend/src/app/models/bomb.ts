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

  constructor(obj = {} as Bomb) {
    this.id = obj.id;
    this.x = obj.x;
    this.y = obj.y;
    this.userId = obj.userId;
    this.detonateAt = obj.detonateAt ? new Date(obj.detonateAt) : null;
  }



}
