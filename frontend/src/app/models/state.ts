import {Bomb} from "./bomb";
import {Player} from "./player";

export class State {
  players: Player[];
  bombs: Bomb[];
  timestamp: Date;
}