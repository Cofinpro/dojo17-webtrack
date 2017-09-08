/**
 * Created by mhinz on 5/26/2016.
 */
function GameImage(src, width, height){

    this.src = src;
    this.width = width ? width : image.width;
    this.height = height ? height : image.height;
    this.shape = null;
    this.canvas = null;
}
GameImage.prototype.getImageSource = function(){
    return this.src;
};
GameImage.prototype.setImageData = function(shape, canvas){
    this.shape = shape;
    this.canvas = canvas;
};
GameImage.prototype.getShape = function(){
    return this.shape;
};

