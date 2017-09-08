function PlayGround(tag, height, width) {

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
    this.tag.style.border = 'solid rgba(0,0,0,0.5) 3px';

}

PlayGround.prototype.setPositionStyle = function (positionStyle) {
    this.tag.style.position = positionStyle;
};

PlayGround.prototype.getPositionStyle = function () {
    return this.tag.style.position;
};

PlayGround.prototype.getPosition = function getPosition() {
    var top = parseInt(this.tag.style.top);
    var left = parseInt(this.tag.style.left);
    return {top: top, left: left};
};
PlayGround.prototype.setBorder = function setBorder(width, style, color) {
    this.tag.style.borderWidth = width + 'px';
    this.tag.style.borderStyle = style;
    this.tag.style.borderColor = color;
};

PlayGround.prototype.getBorder = function () {
    var borderWidth = parseInt(this.tag.style.borderWidth);
    var borderStyle = this.tag.style.borderStyle;
    var borderColor = this.tag.style.borderColor;
    return {width: borderWidth, style: borderStyle, color: borderColor};
};

PlayGround.prototype.setBackgroundColor = function setBackgroundColor(color) {
    this.tag.style.backgroundColor = color;
};

PlayGround.prototype.getBackgroundColor = function getBackgroundColor() {
    return this.tag.style.backgroundColor;
};

PlayGround.prototype.createRectAngle = function (elmHeight, elmWidth, elmTop, elmLeft, color, isObstacle) {
    var ctx = isObstacle ? this.obstaclesContext : this.context;
    return new GERectangle(elmHeight, elmWidth, elmTop, elmLeft, color, ctx);
};
PlayGround.prototype.createCircle = function (elmHeight, elmWidth, elmTop, elmLeft, color, isObstacle) {
    var ctx = isObstacle ? this.obstaclesContext : this.context;
    return new GECircle(elmHeight, elmWidth, elmTop, elmLeft, color, ctx);
};
PlayGround.prototype.createPicture = function (elmTop, elmLeft, image, isObstacle) {
    var ctx = isObstacle ? this.obstaclesContext : this.context;
    return new GEPicture(elmTop, elmLeft, image, ctx);
};
PlayGround.prototype.setPickItUpCallBack = function (callBack) {
    this.pickItUpCallBack = callBack;
};

PlayGround.prototype.setTargetCaughtCallBack = function (callBack) {
    this.targetCaughtCallBack = callBack;
};
PlayGround.prototype.checkBorder = function (element, move) {

    var hrzTarget = element.left + move.horizontal;
    var vrtTarget = element.top + move.vertical;

    var returned = {left: hrzTarget, top: vrtTarget};


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
PlayGround.prototype.addObstacle = function addObstacle(obstacle) {
    this.obstacles[this.obstacles.length] = obstacle;
};
PlayGround.prototype.removeObstacle = function removeObstacle(obstacle) {
    var index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
        this.obstacles.splice(index, 1);
    }
};
PlayGround.prototype.checkObstacle = function (element, move) {
    return element.collisionCorrection(this.obstacles, move);
};

PlayGround.prototype.addPickItUp = function (pickItUp) {
    this.pickItUps[this.pickItUps.length] = pickItUp;
};
PlayGround.prototype.getPickItUps = function () {
    return this.pickItUps;
};
PlayGround.prototype.checkPickItUp = function checkPickItUp(element,  move) {
    var hrzTarget = element.left + move.horizontal;
    var vrtTarget = element.top + move.vertical;
    var caught = element.getOverlappedElements(this.pickItUps,hrzTarget, vrtTarget);

    if(caught.length == 0) return;

    this.pickItUpCallBack(caught);
};
PlayGround.prototype.removePickItUp = function (pickItUp) {
    var index = this.pickItUps.indexOf(pickItUp);
    if (index > -1) {
        this.pickItUps.splice(index, 1);
        pickItUp.clear();
    }
};
PlayGround.prototype.addProtectedArea = function (area) {
    this.protectedAreas[this.protectedAreas.length] = area;
};
PlayGround.prototype.removeProtectedArea = function (area) {
    var index = this.protectedAreas.indexOf(area);
    if (index > -1) {
        this.protectedAreas.splice(index, 1);
        area.clear();
    }
};
PlayGround.prototype.checkProtectedArea = function (position, element) {
    var i;
    for (i = 0; i < this.protectedAreas.length; i++) {
        var result = this.protectedAreas[i].collisionCorrection(position, element.shapeData);
        if (result) return result;
    }
    return false;
};
PlayGround.prototype.addAutoMover = function (mover) {
    this.movers[this.movers.length] = mover;
};
PlayGround.prototype.removeAutoMover = function (mover) {
    var index = this.movers.indexOf(mover);
    if (index > -1) {
        this.movers.splice(index, 1);
        mover.clear();
    }
};
PlayGround.prototype.startMovers = function () {
    var i;
    for (i = 0; i < this.movers.length; i++) {
        this.movers[i].start();
    }

};
PlayGround.prototype.stopMovers = function () {
    var i;
    for (i = 0; i < this.movers.length; i++) {
        this.movers[i].stop();
    }
};
PlayGround.prototype.addTarget = function addTarget(target) {
    this.targets[this.targets.length] = target;
};
PlayGround.prototype.removeTarget = function (target) {
    var index = this.targets.indexOf(target);
    if (index > -1) {
        this.targets.splice(index, 1);
        target.clear();
    }
};
PlayGround.prototype.checkAllTargets = function (element, move) {
    var hrzTarget = element.left + move.horizontal;
    var vrtTarget = element.top + move.vertical;
    var caught = element.getOverlappedElements(this.targets,hrzTarget, vrtTarget);

    if (caught.length == 0)return;
    this.targetCaughtCallBack(caught[0]);
};
PlayGround.prototype.shieldTarget = function (target, millis) {
    var index = this.targets.indexOf(target);
    if (index > -1) {
        this.targets.splice(index, 1);
    }
    this.obstacles[this.obstacles.length] = target;
    if (millis > -1) {
        return setTimeout(this.unShieldTarget, millis, target, this);
    }
};
PlayGround.prototype.unShieldTarget = function (target, that) {
    var index = that.obstacles.indexOf(target);
    if (index > -1) {
        that.obstacles.splice(index, 1);
    }
    that.targets[that.targets.length] = target;
};
PlayGround.prototype.checkCollision = function (position, toBeChecked) {
    for (var i = 0; i < toBeChecked.length; i++) {
        if (toBeChecked[i].collisionCorrection(position)) return toBeChecked[i];
    }
    return null;
};

PlayGround.prototype.pause = function () {
    this.paused = true;
};
PlayGround.prototype.endPause = function () {
    this.paused = false;
};
PlayGround.prototype.isPaused = function () {
    return this.paused;
};
PlayGround.prototype.paintBackGround = function () {
    this.context.drawImage(this.image, 0, 0);
};
PlayGround.prototype.removeGameElement = function (element) {
    this.removePickItUp(element);
    this.removeObstacle(element);
    this.removeTarget(element);
};

PlayGround.prototype.showNotification = function (displayMillis, displayStyle, top, left, message) {
    new GameNotification(displayMillis, displayStyle, top, left, message, this.obstaclesContext).show();
};
module.exports = PlayGround;