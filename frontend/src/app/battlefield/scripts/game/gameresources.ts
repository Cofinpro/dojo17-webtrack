import { ShapeDetector } from '../pixels/shapedetector';
import { GameImage } from './gameimage';

/**
 * Created by mhinz on 5/24/2016.
 */
export class GameResources {

    images = {};
    audios = {};

    imagesLoading;
    audioLoading;
    shapeDetector : ShapeDetector;
    setupFinished;

    constructor() {
        this.imagesLoading = [];
        this.audioLoading = [];
        this.shapeDetector = new ShapeDetector(20);
        this.setupFinished = false;
    }

    imageLoaded(key, shapeData, canvas) {
        const loading = this.imagesLoading.indexOf(key);
        this.imagesLoading.splice(loading, 1);
        this.images[key].setImageData(shapeData, canvas);
        // this.checkLoadedState();
    };

    audioLoaded(key) {
        const loading = this.audioLoading.indexOf(key);
        this.audioLoading.splice(loading, 1);
        // this.checkLoadedState();
    };

    // checkLoadedState(): bool {
    //     if (!this.setupFinished) {
    //         return false;
    //     }
    //     const audioFinished = this.audioLoading.length === 0;
    //     const imagesFinished = this.imagesLoading.length === 0;
    //     if (audioFinished && imagesFinished) {
    //     }
    // }

    addImage(key,src, width, height) {
        if (this.imagesLoading.indexOf(key) > -1) {
            return;
        }
        this.imagesLoading[this.imagesLoading.length] = key;

        const image = this.shapeDetector.detect(src, key, width, height).then( (result) => {
            this.images[result.key] = new GameImage(result.image.src, width, height);
            this.imageLoaded(result.key, result.shapeData, result.canvas);
        });

    };

    addAudio(key, src) {
        if (this.audioLoading.indexOf(key) > -1) {
            return;
        }
        this.audioLoading[this.audioLoading.length] = key;

        let audio = new Audio();
        this.audios[key] = audio;
        audio.onload = this.audioLoaded;
        audio.src = src;
    };

    startLoading() {
        this.setupFinished = true;
    };

    resourcesLoaded(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve();
            }, 3000);
        });
    };
}
