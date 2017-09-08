/**
 * Created by mhinz on 5/24/2016.
 */

function GameResources(){

    var that = this;

    this.images = {};
    this.audios = {};

    this.imagesLoading = [];
    this.audioLoading = [];

    this.shapeDetector = new ShapeDetector(20);

    this.setupFinished = false;

    this.imageLoaded = function(key, shapeData, canvas) {
        var loading = that.imagesLoading.indexOf(key);
        that.imagesLoading.splice(loading,1);
        that.images[key].setImageData(shapeData, canvas);
    };
    this.audioLoaded = function(key) {
        var loading = that.audioLoading.indexOf(key);
        that.audioLoading.splice(loading,1);
    };
    this.addImage = function(key,src, width, height) {
        if(that.imagesLoading.indexOf(key) > -1)return;
        that.imagesLoading[that.imagesLoading.length] = key;
        var image = that.shapeDetector.detect(src, key,that.imageLoaded, width, height);
        that.images[key] = new GameImage(src, width, height);
    };
    this.addAudio = function(key,src) {
        if(that.audioLoading.indexOf(key) > -1)return;
        that.audioLoading[this.audioLoading.length] = key;
        var audio = new Audio();
        that.audios[key] = audio;
        audio.onload = that.audioLoaded(key);
        audio.src = src;
    };

    this.startLoading = function() {
        that.setupFinished = true;
    };
    this.resourcesLoaded = function(){
        if(!that.setupFinished)return false;

        var audioFinished = that.audioLoading.length == 0;
        var imagesFinished = that.imagesLoading.length == 0;
        return audioFinished && imagesFinished;
    };
}
module.exports = GameResources;
