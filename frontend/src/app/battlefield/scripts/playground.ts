import { GEPicture } from "./gameelements/gepicture";
import { GameNotification } from './messages/gamenotification';
import { State, Bomb, Player, Stone, Position} from "../../models";


export class PlayGround {
    image: any;
    targetCaughtCallBack: any;
    obstaclesContext: any;
    context: any;
    obstacles: any;
    pickItUps: any;
    targets: any;
    movers: any;
    protectedAreas: any;
    pickItUpCallBack: any;
    tragetCallBack: any;
    width: any;
    height: any;
    tag: any;
    paused: any;
    canvas: any;
    obstaclesCanvas: any;
    bombs: Bomb[] = [];
    players: Player[] = [];
    playersLastRound: Player[] = [];
    playersLastDirection: any[] = [];
    sprites: any[] = [];
    resources;

    constructor(tag, height, width) {
        this.obstacles = [];
        this.pickItUps = [];
        this.targets = [];
        this.movers = [];
        this.protectedAreas = [];

        this.pickItUpCallBack = null;
        this.tragetCallBack = null;

        this.width = width;
        this.height = height;
        this.tag = tag;
        this.paused = false;

        this.canvas = document.createElement('canvas');
        this.obstaclesCanvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.obstaclesContext = this.obstaclesCanvas.getContext('2d');

        this.canvas.width = width;
        this.canvas.height = height;

        this.obstaclesCanvas.width = width;
        this.obstaclesCanvas.height = height;

        this.canvas.style.position = 'absolute';
        this.obstaclesCanvas.style.position = 'absolute';

        tag.appendChild(this.obstaclesCanvas);
        tag.appendChild(this.canvas);

        this.tag.style.width = width + 'px';
        this.tag.style.height = height + 'px';

    }

    public updateState(state: State) {
        // TODO: removePicture für Bombs die nicht mehr existieren
        if (!this.resources) {
            return;
        }

        this.clearSprites();

        this.updateWeakStones(state.weakStones);

        this.updatePlayers(state.players);

        this.updateBombs(state.bombs);

        this.updateExploded(state.exploded);

    }

    private clearSprites(): void {
        for (const sprite of this.sprites) {
            sprite.clear();
            this.removeGameElement(sprite);
        }
        this.sprites = [];
    }

    private updateWeakStones(stones: Stone[]){
      for(const stone of stones){
        this.createPicture("some", stone.y*32, stone.x*32, this.resources.images['box'])
      }
    }

    private updateExploded(positions: Position[]){
        for(const position of positions){
          this.createPicture("some", position.y*32, position.x*32, this.resources.images['explosion1'])
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
                this.createPicture(player.id, player.y * 32, player.x * 32, this.resources.images['hero-1-' + direction]);
            }
            this.playersLastDirection[player.id] = direction;
        }
        this.playersLastRound = players;
    }

    private updateBombs(bombs: Bomb[]) {
        const now = new Date();
        for (const bomb of bombs) {
            // display correct sprite for bomb according to detonation time
            const timeUntilExplosion = bomb.detonateAt.getTime() - now.getTime();
            let bombSpriteIndex = '';
            if (timeUntilExplosion > 0) {
                bombSpriteIndex = 'bomb' + Math.max(0, Math.round(timeUntilExplosion / 1000));
            } else {
                bombSpriteIndex = 'explosionFullCenter';
            }
            this.createPicture(bomb.id, bomb.y * 32, bomb.x * 32, this.resources.images[bombSpriteIndex]);
        }
        this.bombs = bombs;
        console.log('playground has bombs: ', bombs);
    }

    public setPositionStyle(positionStyle): void {
        this.tag.style.position = positionStyle;
    };

    public getPositionStyle() {
        return this.tag.style.position;
    };

    public getPosition() {
        let top = parseInt(this.tag.style.top);
        let left = parseInt(this.tag.style.left);
        return {top: top, left: left};
    };

    public setBorder(width, style, color): void {
        this.tag.style.borderWidth = width + 'px';
        this.tag.style.borderStyle = style;
        this.tag.style.borderColor = color;
    };

    public getBorder() {
        let borderWidth = parseInt(this.tag.style.borderWidth);
        let borderStyle = this.tag.style.borderStyle;
        let borderColor = this.tag.style.borderColor;

        return {width: borderWidth, style: borderStyle, color: borderColor};
    };

    public setBackgroundColor(color): void {
        this.tag.style.backgroundColor = color;
    };

    public getBackgroundColor() {
        return this.tag.style.backgroundColor;
    };

    // public createRectAngle(elmHeight, elmWidth, elmTop, elmLeft, color, isObstacle) {
    //     let ctx = isObstacle ? this.obstaclesContext : this.context;
    //     return new GERectangle(elmHeight, elmWidth, elmTop, elmLeft, color, ctx);
    // };
    //
    // public createCircle(elmHeight, elmWidth, elmTop, elmLeft, color, isObstacle) {
    //     let ctx = isObstacle ? this.obstaclesContext : this.context;
    //     return new GECircle(elmHeight, elmWidth, elmTop, elmLeft, color, ctx);
    // };

    public createPicture(id, elmTop, elmLeft, image, isObstacle?) {
        let ctx = isObstacle ? this.obstaclesContext : this.context;
        let pic = new GEPicture(id, elmTop, elmLeft, image, ctx);
        this.sprites.push(pic);
        return pic;
    };

    public setPickItUpCallBack(callBack): void {
        this.pickItUpCallBack = callBack;
    };

    public setTargetCaughtCallBack(callBack): void {
        this.targetCaughtCallBack = callBack;
    };

    public checkBorder(element, move) {

        let hrzTarget = element.left + move.horizontal;
        let vrtTarget = element.top + move.vertical;

        let returned = {left: hrzTarget, top: vrtTarget, hrzCollission: false, vrtCollission: false };

        if (move.horizontal < 0 && hrzTarget < 0) {
            returned.left = 0;
            returned.hrzCollission = true;
        }
        if (move.horizontal > 0 && hrzTarget + element.width > this.width) {
            returned.left = this.width - element.width;
            returned.hrzCollission = true;
        }
        if (move.vertical < 0 && vrtTarget < 0) {
            returned.top = 0;
            returned.vrtCollission = true;
        }
        if (move.vertical > 0 && vrtTarget + element.height > this.height) {
            returned.top = this.height - element.height;
            returned.vrtCollission = true;
        }
        return returned;
    };

    public addObstacle(obstacle): void {
        this.obstacles[this.obstacles.length] = obstacle;
    };

    public removeObstacle(obstacle): void {
        let index = this.obstacles.indexOf(obstacle);
        if (index > -1) {
            this.obstacles.splice(index, 1);
        }
    };
    public addBomb(bomb): void {
        this.bombs[this.bombs.length] = bomb;
    };

    public removeBomb(bomb): void {
        let index = this.bombs.indexOf(bomb);
        if (index > -1) {
            this.bombs.splice(index, 1);
        }
    };

    public checkObstacle(element, move) {
        return element.collisionCorrection(this.obstacles, move);
    };

    public addPickItUp(pickItUp): void {
        this.pickItUps[this.pickItUps.length] = pickItUp;
    };

    public getPickItUps() {
        return this.pickItUps;
    };

    public checkPickItUp(element, move): void {
        let hrzTarget = element.left + move.horizontal;
        let vrtTarget = element.top + move.vertical;
        let caught = element.getOverlappedElements(this.pickItUps, hrzTarget, vrtTarget);

        if (caught.length == 0) return;

        this.pickItUpCallBack(caught);
    };

    public removePickItUp(pickItUp): void {
        let index = this.pickItUps.indexOf(pickItUp);
        if (index > -1) {
            this.pickItUps.splice(index, 1);
            pickItUp.clear();
        }
    };

    public addProtectedArea(area): void {
        this.protectedAreas[this.protectedAreas.length] = area;
    };

    public removeProtectedArea(area) {
        let index = this.protectedAreas.indexOf(area);
        if (index > -1) {
            this.protectedAreas.splice(index, 1);
            area.clear();
        }
    };

    public checkProtectedArea(position, element) {
        let i;
        for (i = 0; i < this.protectedAreas.length; i++) {
            let result = this.protectedAreas[i].collisionCorrection(position, element.shapeData);
            if (result) return result;
        }
        return false;
    };

    public addAutoMover(mover) {
        this.movers[this.movers.length] = mover;
    };

    public removeAutoMover(mover) {
        let index = this.movers.indexOf(mover);
        if (index > -1) {
            this.movers.splice(index, 1);
            mover.clear();
        }
    };

    public startMovers() {
        let i;
        for (i = 0; i < this.movers.length; i++) {
            this.movers[i].start();
        }

    };

    public stopMovers() {
        let i;
        for (i = 0; i < this.movers.length; i++) {
            this.movers[i].stop();
        }
    };

    public addTarget(target) {
        this.targets[this.targets.length] = target;
    };

    public removeTarget(target) {
        let index = this.targets.indexOf(target);
        if (index > -1) {
            this.targets.splice(index, 1);
            target.clear();
        }
    };

    public checkAllTargets(element, move) {
        let hrzTarget = element.left + move.horizontal;
        let vrtTarget = element.top + move.vertical;
        let caught = element.getOverlappedElements(this.targets, hrzTarget, vrtTarget);

        if (caught.length == 0) return;
        this.targetCaughtCallBack(caught[0]);
    };

    public shieldTarget(target, millis) {
        let index = this.targets.indexOf(target);
        if (index > -1) {
            this.targets.splice(index, 1);
        }
        this.obstacles[this.obstacles.length] = target;
        if (millis > -1) {
            return setTimeout(this.unShieldTarget, millis, target, this);
        }
    };

    public unShieldTarget(target, that) {
        let index = that.obstacles.indexOf(target);
        if (index > -1) {
            that.obstacles.splice(index, 1);
        }
        that.targets[that.targets.length] = target;
    };

    public checkCollision(position, toBeChecked) {
        for (let i = 0; i < toBeChecked.length; i++) {
            if (toBeChecked[i].collisionCorrection(position)) return toBeChecked[i];
        }
        return null;
    };

    public pause() {
        this.paused = true;
    };

    public endPause() {
        this.paused = false;
    };

    public isPaused() {
        return this.paused;
    };

    public paintBackGround() {
        this.context.drawImage(this.image, 0, 0);
    };

    public removeGameElement(element) {
        this.removePickItUp(element);
        this.removeObstacle(element);
        this.removeTarget(element);
    };

    public showNotification(displayMillis, displayStyle, top, left, message) {
        new GameNotification(displayMillis, displayStyle, top, left, message, this.obstaclesContext).show();
    };

}
