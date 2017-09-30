import { GameResources } from "./gameresources";
import { Screen } from "../paint/screen";
import { Position } from "../shared";
import { PaintedCanvas, PositionedPaintableCanvas } from "../paint";
import { State, BattleField, Bomb, Player, Stone, Bush, NewPlayer, BombCountPowerup, BlastRadiusPowerup } from "../models";
import { PlayerDataService } from "../services/player-data.service";

export class PlayGround {

    public players: Player[] = [];
    private playersLastRound: Player[] = [];

    private screen: Screen;
    private ownPlayerDied: boolean;
    private ownPlayer: NewPlayer;
    private playersLastDirection: string[] = [];
    private sprites: PaintedCanvas[] = [];
    private fixeds: PaintedCanvas[] = [];

    private battleField: BattleField;

    private images: {};
    private audios: {};
    private battleFieldSizeX: number;
    private battleFieldSizeY: number;

    private readonly squareSize : number = 32;

    constructor(private tag: HTMLElement, private height: number, private width: number, private playerDataService: PlayerDataService) {
        this.screen = new Screen(tag, height, width);
    }

    public setPlayer(player: NewPlayer) {
        this.ownPlayer = player;
    }
    public setImages(images: {}) {
        this.images = images;
    }
    public setAudios(audios: {}) {
        this.audios = audios;
    }
    public paintBattleField(battleField: BattleField) {

        if (!this.images) {
            return;
        }
        this.clearFixed();
        this.battleField = battleField;
        this.updateFixStones(this.battleField.fixStones);
        this.updateFoliage(this.battleField.foliage);

    }
    public updateState(state: State) {

        if (!this.images) {
            return;
        }

        if (!this.battleFieldSizeX) {
            this.battleFieldSizeX = state.sizeX;
        }

        if (!this.battleFieldSizeY) {
            this.battleFieldSizeY = state.sizeY;
        }

        this.clearSprites();

        this.updateWeakStones(state.weakStones);

        this.updateBlastRadiusPowerups(state.blastRadiusPowerups);

        this.updateBombCountPowerups(state.bombCountPowerups);

        this.updateBombs(state.bombs, state.serverTime);

        this.updateExploded(state.exploded);

        this.updatePlayers(state.players);

        if (this.battleField && this.battleField.foliage) {
            this.updateFoliage(this.battleField.foliage);
        }

    }

    private clearSprites(): void {
        for (const sprite of this.sprites) {
            sprite.clear();
        }
        this.sprites = [];
    }
    private clearFixed() : void{
        for (const fixed of this.fixeds) {
            fixed.clear();
        }
        this.fixeds = [];
    }

    private updateFixStones(stones: Stone[]) {
        for (const stone of stones) {
            let imageId = 'wall-light';
            if (stone.x !== 0 && (stone.y === 0 || stone.y === this.battleFieldSizeY)) {
                imageId = 'wall-dark';
            }
            this.createPicture('fixStone-id', stone.x, stone.y, this.images[imageId], false);
        }
    }

    private updateWeakStones(stones: Stone[]) {
        for (const stone of stones) {
            this.createPicture('weakStone-id',  stone.x, stone.y, this.images['box'], true);
        }
    }

    private updateFoliage(foliage: Bush[]) {
        for (const bush of foliage) {
            this.createPicture('bush-id', bush.x, bush.y, this.images['bush'], true);
        }
    }

    private updateBombCountPowerups(powerups: BombCountPowerup[]) {
        for (const powerup of powerups) {
            this.createPicture('bombCoundPowerup-id',  powerup.x, powerup.y, this.images['powerupBlue'], true);
        }
    }

    private updateBlastRadiusPowerups(powerups: BlastRadiusPowerup[]) {
        for (const powerup of powerups) {
            this.createPicture('blastRadiusPowerup-id',  powerup.x, powerup.y, this.images['powerupRed'], true), true;
        }
    }

    private updateExploded(positions: Position[]) {
        //nothing to do
        if(positions.length === 0){
            return;
        }    

        const explosions = [];
        const image = this.images['explosionFullCenter']; 
        for (const position of positions) {
            const newPosition = {x : position.x * this.squareSize, y : position.y * this.squareSize};
            explosions.push(new PositionedPaintableCanvas(image, new Position(newPosition)));    
        }
        if(this.playerDataService.getUseAudio()){
           this.audios['boom'].play();
        }
        this.screen.createFadeInFadeOut(explosions,400,2000);
    }


    private updatePlayers(players: Player[]) {

        for (const player of players) {
            let direction = '';
            const playerFromLastRound = this.playersLastRound.find((oldPlayer) => oldPlayer.id === player.id);

            if (this.playersLastRound.length === 0 || playerFromLastRound === undefined) {
                direction = 'd';
            } else {
                if (playerFromLastRound.x < player.x) {
                    // move right
                    direction = 'r';
                } else if (playerFromLastRound.x > player.x) {
                    // move left
                    direction = 'l';
                } else if (playerFromLastRound.y < player.y) {
                    // move down
                    direction = 'd';
                } else if (playerFromLastRound.y > player.y) {
                    // move up
                    direction = 'u';
                } else {
                    // no movement
                    direction = this.playersLastDirection[player.id];
                }
            }
            const playerImageId = this.calculatePlayerId(player.id);
            const imageToPaint = this.images['hero-' + playerImageId + '-' + direction];
            if(player.id === this.ownPlayer.id){
                imageToPaint.addOverlay(this.images['thats-me'], 0,0);
            }

            this.createPicture(
                player.id,
                player.x,
                player.y,
                imageToPaint,
                true
            );
            this.playersLastDirection[player.id] = direction;
        }
        this.playersLastRound = players;
        // still alive or died?
        if (this.ownPlayer && !players.find((player) => player.id === this.ownPlayer.id)) {
            this.ownPlayerDied = true;
        }
    }

    public resetPlayGround() : void{
        this.ownPlayer = null;
        this.ownPlayerDied = false;
        this.battleField = null;
        this.clearFixed();
        this.clearSprites();
    }

    public isGameOver(): boolean {
        return this.ownPlayerDied;
    }
    public isReady(): boolean {
        return this.screen && this.images != null;
    }

    private calculatePlayerId(playerId: string) {
        let avatarId = this.playerDataService.getPlayerAvatarId();
        return (this.ownPlayer.id === playerId ? avatarId : this.getOpponentImageId(playerId, avatarId));
    }

    private getOpponentImageId(id, ownAvatarId) {
        let opponent: number = (id.charCodeAt(0) + id.charCodeAt(1)) % 7 + 2;
        if (opponent == ownAvatarId) {
            return 1;
        }
        return opponent;
    }

    private updateBombs(bombs: Bomb[], serverTime) : void{
        for (const bomb of bombs) {
            // display correct sprite for bomb according to detonation time
            const timeUntilExplosion = bomb.detonateAt.getTime() - serverTime;
            // console.log('time until explosion: ', timeUntilExplosion);
            let bombSpriteIndex = '';
            if (timeUntilExplosion > 0) {
                bombSpriteIndex = 'bomb' + Math.min(Math.max(0, Math.round(timeUntilExplosion / 1000) * 2), 5);
            } else {
                bombSpriteIndex = 'explosionFullCenter';
            }
            this.createPicture(bomb.id, bomb.x, bomb.y, this.images[bombSpriteIndex], true);
        }
    }

    private createPicture(id, elmLeft, elmTop, image, addToSprites) : void {
        const pic: PaintedCanvas = this.screen.createPicture(id, elmLeft * this.squareSize, elmTop * this.squareSize, image);
        if (addToSprites) {
            this.sprites.push(pic);
        }else{
            this.fixeds.push(pic);
        }
    }
}