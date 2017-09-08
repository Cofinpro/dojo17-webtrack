/**
 * Created by mhinz on 5/22/2016.
 */
function GERectangle(elmHeight, elmWidth, elmTop, elmLeft, color, context){
    this.context = context;

    this.height = elmHeight;
    this.width = elmWidth;
    this.top = elmTop;
    this.left = elmLeft;
    this.color = color;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
    this.placeTag();

}
GERectangle.prototype = new AbstractGameElement;
