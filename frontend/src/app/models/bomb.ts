/**
 * The Bomb class
 * - represents a bomb
 * - can be set by a user
 * - is synchronized to other users
 *
 */
export class Bomb {

  id?: string;
  x?: number;
  y?: number;
  userId: string;
<<<<<<< HEAD
  detonateAt?: Date;
=======
  detonateAt: Date;
  blastRadius: number;
>>>>>>> a821d8dfca2a727c077caee4045c7a8be682e4c1

  constructor(obj = {} as Bomb) {
    this.id = obj.id;
    this.x = obj.x;
    this.y = obj.y;
    this.userId = obj.userId;
    this.detonateAt = obj.detonateAt ? new Date(obj.detonateAt) : null;
    this.blastRadius = obj.blastRadius;
  }



}
