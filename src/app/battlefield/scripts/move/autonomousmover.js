/**
 * Created by mhinz on 5/11/2016.
 */
function AutonomousMover(element, playGround) {

    this.stepWidth = 10;
    this.lastAnimationFrameTime = 0;

    this.activeHrz = Direction.right;
    this.activeVrt = Direction.down;

    this.element = element;
    this.playGround = playGround;
    this.paused = false;

    this.animate = false;
}
AutonomousMover.prototype = Object.create(AbstractAnimated.prototype);

AutonomousMover.prototype.draw = function (moveBy) {

    var that = this;
    if (!that.element || that.element == null)return;
    var tested = that.element;

    var move = {horizontal: 0, vertical: 0};

    if (that.activeHrz == Direction.right)move.horizontal = moveBy;
    if (that.activeHrz == Direction.left)move.horizontal = moveBy * -1;

    if (that.activeVrt == Direction.down)move.vertical = moveBy;
    if (that.activeVrt == Direction.up)move.vertical = moveBy * -1;

    var newPos = that.playGround.checkBorder(tested, move);
    if(newPos.hrzCollission || newPos.vrtCollission){
        tested.setPosition(newPos.top, newPos.left);
        that.playGround.checkAllTargets(tested, move);
        if (newPos.hrzCollission) that.activeHrz = that.activeHrz == Direction.right ? Direction.left : Direction.right;
        if (newPos.vrtCollission) that.activeVrt = that.activeVrt == Direction.down ? Direction.up : Direction.down;
        return;
    }

    if(newPos.hrzCollission || newPos.vrtCollission)return;

    newPos = that.playGround.checkObstacle(tested,move);
    tested.setPosition(newPos.top, newPos.left);
    that.playGround.checkAllTargets(tested, move);
    if (newPos.hrzCollission) that.activeHrz = that.activeHrz == Direction.right ? Direction.left : Direction.right;
    if (newPos.vrtCollission) that.activeVrt = that.activeVrt == Direction.down ? Direction.up : Direction.down;





};