import { ShapeDetector } from '../pixels/shapedetector';
import { GameImage } from './gameimage';

/**
 * Created by mhinz on 5/24/2016.
 */
export class GameResources {

    images = {};
    audios = {};

    imagesLoading = [];
    audioLoading = [];

    shapeDetector = new ShapeDetector(20);

    setupFinished = false;

    imageLoaded = function(key, shapeData, canvas) {
        const loading = this.imagesLoading.indexOf(key);
        this.imagesLoading.splice(loading,1);
        this.images[key].setImageData(shapeData, canvas);
    };

    audioLoaded = function(key) {
        const loading = this.audioLoading.indexOf(key);
        this.audioLoading.splice(loading, 1);
    };

    addImage = function(key,src, width, height) {
        if (this.imagesLoading.indexOf(key) > -1) {
            return;
        }
        this.imagesLoading[this.imagesLoading.length] = key;

        const image = this.shapeDetector.detect(src, key, this.imageLoaded, width, height);

        this.images[key] = new GameImage(src, width, height);
    };

    addAudio = function(key, src) {
        if (this.audioLoading.indexOf(key) > -1) {
            return;
        }
        this.audioLoading[this.audioLoading.length] = key;

        const audio = new Audio();
        this.audios[key] = audio;

        audio.onload = this.audioLoaded(key);
        audio.src = src;
    };

    startLoading = function() {
        this.setupFinished = true;
    };

    resourcesLoaded = function(){
        if (!this.setupFinished) {
            return false;
        }

        const audioFinished = this.audioLoading.length === 0;
        const imagesFinished = this.imagesLoading.length === 0;
        return audioFinished && imagesFinished;
    };
}
