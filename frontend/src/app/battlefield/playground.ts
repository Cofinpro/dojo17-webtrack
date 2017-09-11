import { GameResources } from "../game/gameresources";
import { PaintableField } from "../paintable/paintable-field";
import { PaintedCanvas } from "../paintable/painted-canvas";
import { State, Bomb, Player, Stone, Bush, Position, NewPlayer, BombCountPowerup, BlastRadiusPowerup } from "../models";
import {PlayerDataService} from "../services/player-data.service";

export class PlayGround {

    public players: Player[] = [];
    
    private paintableField : PaintableField;
    private bombs: Bomb[] = [];
    private ownPlayerDied: boolean;
    private ownPlayer: NewPlayer;
    private playersLastRound: Player[] = [];
    private playersLastDirection: any[] = [];
    private sprites: PaintedCanvas[] = [];

    private resources : GameResources;
    private battleFieldSizeX: number;
    private battleFieldSizeY: number;

    constructor(private tag: any, private height: number, private width: number, private playerDataService: PlayerDataService) {
        this.paintableField = new PaintableField(tag,height,width);
        this.ownPlayerDied = false;
    }

    public setPlayer(player: NewPlayer) {
        this.ownPlayer = player;
    }
    public setResources(gameResources: GameResources){
        this.resources = gameResources;
    }
    public updateState(state: State) {

        if (!this.resources) {
            return;
        }

        if (!this.battleFieldSizeX) {
            this.battleFieldSizeX = state.sizeX;
        }

        if (!this.battleFieldSizeY) {
            this.battleFieldSizeY = state.sizeY;
        }

        this.clearSprites();

        this.updateFixStones(state.fixStones);

        this.updateWeakStones(state.weakStones);

        this.updateBlastRadiusPowerups(state.blastRadiusPowerups);

        this.updateBombCountPowerups(state.bombCountPowerups);

        this.updateBombs(state.bombs, state.serverTime);

        this.updateExploded(state.exploded);

        this.updatePlayers(state.players);

        this.updateFoliage(state.foliage);
    }

    private clearSprites(): void {
        for (const sprite of this.sprites) {
            sprite.clear();
        }
        this.sprites = [];
    }

    private updateFixStones(stones: Stone[]) {
        for (const stone of stones) {
            let imageId = 'wall-light';
            if (stone.x !== 0 && (stone.y === 0 || stone.y === this.battleFieldSizeY)) {
                imageId = 'wall-dark';
            }
            this.createPicture('fixStone-id', stone.y * 32, stone.x * 32, this.resources.images[imageId]);
        }
    }

    private updateWeakStones(stones: Stone[]) {
        for (const stone of stones) {
            this.createPicture('weakStone-id', stone.y * 32, stone.x * 32, this.resources.images['box']);
        }
    }

    private updateFoliage(foliage: Bush[]) {
        for (const bush of foliage) {
            this.createPicture('bush-id', bush.y * 32, bush.x * 32, this.resources.images['bush']);
        }
    }

    private updateBombCountPowerups(powerups: BombCountPowerup[]) {
        for (const powerup of powerups) {
            this.createPicture('bombCoundPowerup-id', powerup.y * 32, powerup.x * 32, this.resources.images['powerupBlue']);
        }
    }

    private updateBlastRadiusPowerups(powerups: BlastRadiusPowerup[]) {
        for (const powerup of powerups) {
            this.createPicture('blastRadiusPowerup-id', powerup.y * 32, powerup.x * 32, this.resources.images['powerupRed']);
        }
    }

    private updateExploded(positions: Position[]){
        for (const position of positions){
            this.createPicture('some', position.y * 32, position.x * 32, this.resources.images['explosionFullCenter']);
        }
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
                const playerImageId = this.calculatePlayerId(player.id);

                this.createPicture(
                    player.id,
                    player.y * 32,
                    player.x * 32,
                    this.resources.images['hero-' + playerImageId + '-' + direction]
                );
            }
            this.playersLastDirection[player.id] = direction;
        }
        this.playersLastRound = players;
        // still alive or died?
        if (this.ownPlayer && !players.find((player) => player.id === this.ownPlayer.id)) {
            this.ownPlayerDied = true;
        }
    }

    private calculatePlayerId(playerId: string){
      let avatarId = this.playerDataService.getPlayerAvatarId();
      return (this.ownPlayer.id === playerId ? avatarId : this.getOpponentImageId(playerId, avatarId));
    }

    public isGameOver(): boolean {
        return this.ownPlayerDied;
    }
    public isReady(): boolean{
        return this.paintableField && this.resources != null;
    }

    private getOpponentImageId(id, ownAvatarId) {
        let opponent: number = (id.charCodeAt(0) + id.charCodeAt(1)) % 7 + 2;
        if(opponent == ownAvatarId){
          return 1;
        }
        return opponent;
    }

    private updateBombs(bombs: Bomb[], serverTime) {
        for (const bomb of bombs) {
            // display correct sprite for bomb according to detonation time
            const timeUntilExplosion = bomb.detonateAt.getTime() - serverTime;
            console.log('time until explosion: ', timeUntilExplosion);
            let bombSpriteIndex = '';
            if (timeUntilExplosion > 0) {
                bombSpriteIndex = 'bomb' + Math.min(Math.max(0, Math.round(timeUntilExplosion / 1000) * 2), 5);
            } else {
                bombSpriteIndex = 'explosionFullCenter';
            }
            this.createPicture(bomb.id, bomb.y * 32, bomb.x * 32, this.resources.images[bombSpriteIndex]);
        }
        this.bombs = bombs;
    }





    public createPicture(id, elmTop, elmLeft, image, isObstacle?) {
        const pic: PaintedCanvas = this.paintableField.createPicture(id,elmTop,elmLeft,image,isObstacle);
        this.sprites.push(pic);
    }

    public paintBackGround(image: any) {
        this.paintableField.paintBackGround(image);
    }


}