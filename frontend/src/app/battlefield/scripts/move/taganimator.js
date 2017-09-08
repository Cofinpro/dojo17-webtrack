function TagAnimator(element, playGround) {

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

}

TagAnimator.prototype = new AbstractAnimated;

TagAnimator.prototype.addToActiveDirections = function (direction) {

    var that = this;

    var index = this.directions.indexOf(direction);
    //the key is already handled --> nothing to do
    if (index > -1) return;

    this.directions[this.directions.length] = direction;
    if (this.animate) return;

    this.animate = true;
    requestAnimationFrame(function (time) {
        that.doAnimation(that, time);
    });
};
TagAnimator.prototype.removeFromActiveDirections = function (direction) {
    var index = this.directions.indexOf(direction);
    this.directions.splice(index, 1);

    //still one or more key(s) down --> do not stop
    if (this.directions.length > 0) return;

    this.animate = false;
    this.lastAnimationFrameTime = 0;
};

TagAnimator.prototype.setImages = function (images) {
    this.images = images;
    this.currentImage = this.images['right'];
};
TagAnimator.prototype.draw = function (moveBy) {

    var rightPressed = this.directions.indexOf(Direction.right) > -1;
    var leftPressed = this.directions.indexOf(Direction.left) > -1;
    var upPressed = this.directions.indexOf(Direction.up) > -1;
    var downPressed = this.directions.indexOf(Direction.down) > -1;

    var move = {horizontal: 0, vertical:0};
    if (leftPressed && !rightPressed) move.horizontal = moveBy * -1;
    if (rightPressed && !leftPressed) move.horizontal = moveBy;

    if (upPressed && !downPressed) move.vertical = moveBy * -1;
    if (downPressed && !upPressed) move.vertical = moveBy;

    if(move.horizontal == 0 && move.vertical == 0) return;

    var imageToPaint = this.images['right'];
    if(move.horizontal < 0)imageToPaint = this.images['left'];

    if (imageToPaint && imageToPaint != this.currentImage && move.horizontal != 0) {
        this.element.setImage(imageToPaint);
        this.currentImage = imageToPaint;
    }

    var newPos = this.playGround.checkBorder(this.element, move);
    if(newPos.hrzCollission || newPos.vrtCollission){
        this.element.setPosition(newPos.top, newPos.left);
        this.playGround.checkPickItUp(this.element, move);
        return;
    }

    newPos = this.playGround.checkObstacle(this.element,move);
    this.element.setPosition(newPos.top, newPos.left);
    this.playGround.checkPickItUp(this.element, move);
};