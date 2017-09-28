import { Injectable } from '@angular/core';

@Injectable()
export class PlayerDataService {

    private playerName: string;
    private playerAvatarId: number = 1;
    private useAudio: boolean;
    
    public getPlayerName(): string {
        return this.playerName;
    }

    public setPlayerName(playername: string): void {
        this.playerName = playername;
    }

    public getPlayerAvatarId(): number {
        return this.playerAvatarId;
    }

    public setPlayerAvatarId(playerAvatarId: number): void {
        this.playerAvatarId = playerAvatarId;
    }

    public setUseAudio(use: boolean) : void{
        this.useAudio = use;
    }

    public getUseAudio() : boolean{
       return this.useAudio;
    }

}
