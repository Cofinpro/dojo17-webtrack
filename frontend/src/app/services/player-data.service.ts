import { Injectable } from '@angular/core';

@Injectable()
export class PlayerDataService {

  playerName: string;
  playerAvatarId: number = 1;

  constructor() { }

  public getPlayerName(): string {
    return this.playerName;
  }

  public setPlayerName(playername: string): void {
    this.playerName = playername;
  }

  public getPlayerAvatarId(): number {
   // console.log("avatar ", this.playerAvatarId);
    return this.playerAvatarId;
  }

  public setPlayerAvatarId(playerAvatarId: number): void {
    console.log("player id", playerAvatarId);
    this.playerAvatarId = playerAvatarId;
  }


}
