/**
 * Created by mhinz on 5/20/2016.
 */
function GEPicture(elmTop, elmLeft, gameImage, context) {

    this.context = context;
    this.gameImage = gameImage;

    this.height = gameImage.height;
    this.width = gameImage.width;
    this.top = elmTop;
    this.left = elmLeft;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

    this.shapeData = gameImage.getShape();

    this.placeTag();
}


GEPicture.prototype = new AbstractGameElement;
GEPicture.prototype.constructor = GEPicture;

GEPicture.prototype.placeTag = function () {
    this.context.fillStyle = 'rgba(0,0,0,0.0)';
    this.context.fillRect(this.left,this.top,this.width, this.height);
    this.context.drawImage(this.gameImage.canvas, this.left, this.top);
};
GEPicture.prototype.setImage = function (image) {
    this.gameImage = image;
    this.shapeData = this.gameImage.getShape();
};
GEPicture.prototype.getLeft = function (row) {
    return this.left + this.shapeData.getLeftLineResidual(row);
};
GEPicture.prototype.getRight = function (row) {
    return this.right - this.shapeData.getRightLineResidual(row);
};
GEPicture.prototype.getTop = function (col) {
    return this.top + this.shapeData.getTopColumnResidual(col);
};
GEPicture.prototype.getBottom = function (col) {
    return this.bottom - this.shapeData.getBottomColumnResidual(col);
};



