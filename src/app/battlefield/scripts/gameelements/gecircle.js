/**
 * Created by mhinz on 5/19/2016.
 */

function GECircle(elmHeight, elmWidth, elmTop, elmLeft, color, context) {
    this.context = context;
    this.height = elmHeight;
    this.width = elmWidth;
    this.top = elmTop;
    this.left = elmLeft;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

    this.color = color;
    this.placeTag();

}

GECircle.prototype = new AbstractGameElement;

GECircle.prototype.placeTag = function () {
    this.context.beginPath();
    this.context.fillStyle = this.color;
    var offset = this.width / 2;
    this.context.arc(this.left + offset, this.top + offset, offset, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
};
