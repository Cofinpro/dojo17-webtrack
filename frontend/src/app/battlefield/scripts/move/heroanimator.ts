import { PlayGround } from '../playground';
import { Direction } from './direction';
/**
 * Created by mhinz on 5/12/2017.
 */
export class HeroAnimator {

    stepWidth: number;
    lastAnimationFrameTime: number;
    paused: boolean;
    animate: boolean;
    element: any;
    playGround: PlayGround;
    rightBorder: number;
    bottomBorder: number;
    currentImage: any;
    directions: any;
    images: any;


    constructor(element: any, playGround: PlayGround){
        this.stepWidth = 20;

        this.element = element;
        this.playGround = playGround;
        this.animate = false;
        this.paused = false;

        this.lastAnimationFrameTime = 0;

        this.rightBorder = this.playGround.width - this.element.width;
        this.bottomBorder = this.playGround.height - this.element.height;

        this.currentImage = null;

        this.element.setPosition(5, 5);

        this.directions = [];
        this.images = [];
    }

   calculateMoveBy(now: number): number {
        if (this.lastAnimationFrameTime == 0){
            return 1;
        }

        let dif = now - this.lastAnimationFrameTime;
        let fps = Math.ceil(1000 / dif);

        return Math.ceil(this.stepWidth * 10 / fps);
    };

    pause(): void {
        this.paused = true;
    };

    endPause(): void {
        this.paused = false;
    };

    stop(): void {
        this.animate = false;
    };

    doAnimation(time: number): void {

        if (!this.animate){
            return;
        }

        let paused = this.paused || this.playGround.isPaused();
        if (!paused) {
            let moveBy = this.calculateMoveBy(time);
            this.draw(moveBy);
        }
        this.lastAnimationFrameTime = time;
        requestAnimationFrame(t => {
            this.doAnimation(t);
        });
    };

    addToActiveDirections(direction: Direction) {

        let index = this.directions.indexOf(direction);
        //the key is already handled --> nothing to do
        if (index > -1) return;

        this.directions[this.directions.length] = direction;
        if (this.animate) return;

        this.animate = true;
        requestAnimationFrame((time: number) => {
            this.doAnimation(time);
        });
    };

    removeFromActiveDirections(direction: Direction): void {
        let index = this.directions.indexOf(direction);
        this.directions.splice(index, 1);

        //still one or more key(s) down --> do not stop
        if (this.directions.length > 0) {
            return;
        }

        this.animate = false;
        this.lastAnimationFrameTime = 0;
    };

    setImages(images: any) {
        this.images = images;
        this.currentImage = this.images['right'];
    };

    draw(moveBy: any): void {

    let rightPressed = this.directions.indexOf(Direction.right) > -1;
    let leftPressed = this.directions.indexOf(Direction.left) > -1;
    let upPressed = this.directions.indexOf(Direction.up) > -1;
    let downPressed = this.directions.indexOf(Direction.down) > -1;

    let move = {horizontal: 0, vertical:0};
    if (leftPressed && !rightPressed) move.horizontal = moveBy * -1;
    if (rightPressed && !leftPressed) move.horizontal = moveBy;

    if (upPressed && !downPressed) move.vertical = moveBy * -1;
    if (downPressed && !upPressed) move.vertical = moveBy;

    if(move.horizontal == 0 && move.vertical == 0) return;

    let imageToPaint = this.images['right'];
    if(move.horizontal < 0)imageToPaint = this.images['left'];

    if (imageToPaint && imageToPaint != this.currentImage && move.horizontal != 0) {
        this.element.setImage(imageToPaint);
        this.currentImage = imageToPaint;
    }

    let newPos = this.playGround.checkBorder(this.element, move);
    if(newPos.hrzCollission || newPos.vrtCollission){
        this.element.setPosition(newPos.top, newPos.left);
        this.playGround.checkPickItUp(this.element, move);
        return;
    }

    newPos = this.playGround.checkObstacle(this.element,move);
    this.element.setPosition(newPos.top, newPos.left);
    this.playGround.checkPickItUp(this.element, move);
};


    start(): void  {
        this.animate = true;
        requestAnimationFrame(function (time) {
            this.doAnimation(this, time);
        });
    };

}


