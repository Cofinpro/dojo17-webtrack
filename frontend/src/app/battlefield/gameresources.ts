import { Image2Canvas } from '../paint/image-2-canvas';
import { PaintableCanvas } from '../paint/paintable-canvas';

/**
 * Created by mhinz on 5/24/2016.
 */
export class GameResources {

    public images : PaintableCanvas[] = [];
    public audios = [];


    public addImage(key,src, width, height) : void {
        if (this.images.indexOf(key) > -1) {
            return;
        }

        const image = Image2Canvas.detect(src, key, width, height).then( (result : HTMLCanvasElement) => {
            this.images[key] = new PaintableCanvas(result, width, height);
        });

    }

    public addAudio(key, src) : void {
        if (this.audios.indexOf(key) > -1) {
            return;
        }

        let audio = new Audio();
        this.audios[key] = audio;
        audio.src = src;
    }

}
