/**
 * Created by mhinz on 5/22/2016.
 */

function ShapeDetector(threshold) {
    var that = this;
    this.threshold = 20;
    if(threshold || threshold == 0){
        this.threshold = threshold;
    }

    this.detect = function (src, key, callBack, width, height) {

        var image = new Image();

        image.onload = function () {
            if(!width)width = image.width;
            if(!height)height = image.height;
            that.doDetect(image, key, callBack, width, height);
        };
        image.src = src;
        return src;
    };
    this.doDetect = function (image, key, callBack, width, height) {
        var canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        //prepare
        var canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image,0,0, width, height);
        //read lines
        var shapeData = new ShapeData(width, height);
        var i;
        var j;
        for (i = 0; i < height; i++) {
            var imageData = canvasContext.getImageData(0, i, width, 1);
            var lineData = that.scanLine(imageData.data);

            for(j = 0; j < lineData.length; j++){
                if(lineData[j] >= that.threshold){
                    shapeData.addDot(j, i);
                }
            }
        }
        callBack(key, shapeData, canvas);
    };
    this.scanLine = function (data) {
        var returned = [];
        var i;
        var count = 0;
        for (i = 0; i < data.length; i += 4) {
            returned[count] = data[i + 3];
            count++;
        }
        return returned;
    };
}
module.exports = ShapeDetector;