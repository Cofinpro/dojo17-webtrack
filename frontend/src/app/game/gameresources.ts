import { Image2Canvas } from '../paint/image-2-canvas';
import { PaintableCanvas } from '../paint/paintable-canvas';

/**
 * Created by mhinz on 5/24/2016.
 */
export class GameResources {

    images = [];
    audios = [];


    addImage(key,src, width, height) {
        if (this.images.indexOf(key) > -1) {
            return;
        }

        const image = Image2Canvas.detect(src, key, width, height).then( (result) => {
            this.images[result.key] = new PaintableCanvas(result.canvas, width, height);
        });

    };

    addAudio(key, src) {
        if (this.audios.indexOf(key) > -1) {
            return;
        }

        let audio = new Audio();
        this.audios[key] = audio;
        audio.src = src;
    };

    resourcesLoaded(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve();
            }, 3000);
        });
    };
}
