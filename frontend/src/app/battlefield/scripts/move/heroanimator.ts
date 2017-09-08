  /**
 * Created by mhinz on 5/12/2016.
 */

function AbstractAnimated() {
    this.stepWidth = 10;
    this.lastAnimationFrameTime = 0;
}
AbstractAnimated.prototype.calculateMoveBy = function (now) {
    if (this.lastAnimationFrameTime == 0)return 1;

    var dif = now - this.lastAnimationFrameTime;
    var fps = Math.ceil(1000 / dif);

    return Math.ceil(this.stepWidth * 10 / fps);
};
AbstractAnimated.prototype.pause = function () {
    this.paused = true;
};
AbstractAnimated.prototype.endPause = function () {
    this.paused = false;
};
AbstractAnimated.prototype.stop = function () {
    this.animate = false;
};
AbstractAnimated.prototype.doAnimation = function (that, time) {

    if (!that.animate)  return;

    var paused = that.paused || that.playGround.isPaused();
    if (!paused) {
        var moveBy = that.calculateMoveBy(time);
        that.draw(moveBy);
    }
    that.lastAnimationFrameTime = time;
    requestAnimationFrame(function (t) {
        that.doAnimation(that, t);
    });
};
AbstractAnimated.prototype.start = function () {
    var that = this;
    that.animate = true;

    requestAnimationFrame(function (time) {
        that.doAnimation(that, time);
    });
};
