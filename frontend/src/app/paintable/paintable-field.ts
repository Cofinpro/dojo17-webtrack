import { PaintableCanvas } from "./paintable-canvas";
import { PaintedCanvas } from "./painted-canvas";
export class PaintableField {

    private canvas: any;
    private obstaclesCanvas: any;
    private context: any;
    private obstaclesContext: any;

    constructor(private tag: any, private height: number, private width: number){
        this.canvas = document.createElement('canvas');
        this.obstaclesCanvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.obstaclesContext = this.obstaclesCanvas.getContext('2d');

        this.canvas.width = width;
        this.canvas.height = height;

        this.obstaclesCanvas.width = width;
        this.obstaclesCanvas.height = height;

        this.canvas.style.position = 'absolute';
        this.obstaclesCanvas.style.position = 'absolute';

        this.tag.appendChild(this.obstaclesCanvas);
        this.tag.appendChild(this.canvas);

        this.tag.style.width = width + 'px';
        this.tag.style.height = height + 'px';

    }

    createPicture(id: string, elmTop: number, elmLeft: number, image: PaintableCanvas, isObstacle: boolean): PaintedCanvas{
        let ctx = isObstacle ? this.obstaclesContext : this.context;
        let pic = new PaintedCanvas(id, elmTop, elmLeft, image, ctx);
        return pic;
    }
    paintBackGround(image){
        this.context.drawImage(image, 0, 0);
    }







}
