import { PaintableCanvas, PositionedPaintableCanvas, PaintedCanvas } from ".";
import { FadingCanvases } from "./fading-canvases";
export class Screen {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private dynamicCanvas: HTMLCanvasElement;
    private dynamicContext: CanvasRenderingContext2D;

    constructor(private tag: HTMLElement, private height: number, private width: number){
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.dynamicCanvas = document.createElement('canvas');
        this.dynamicContext = this.dynamicCanvas.getContext('2d');

        this.canvas.width = width;
        this.canvas.height = height;
 
        this.dynamicCanvas.width = width;
        this.dynamicCanvas.height = height;

        this.canvas.style.position = 'absolute';
        this.dynamicCanvas.style.position = 'absolute';
        
        this.tag.appendChild(this.canvas);
        this.tag.appendChild(this.dynamicCanvas);

        this.tag.style.width = width + 'px';
        this.tag.style.height = height + 'px';

    }

    public createPicture(id: string, elmLeft: number, elmTop: number,  image: PaintableCanvas): PaintedCanvas{
        let pic = new PaintedCanvas(id, elmLeft, elmTop,  image, this.context);
        return pic;
    }

    public createFadeInFadeOut(images : PositionedPaintableCanvas[], fadeInTimeMillis : number, fadeOutTimeMillis : number) : void{
        new FadingCanvases(images,fadeInTimeMillis,fadeOutTimeMillis,this.dynamicContext).start();
    }

    public paintBackGround(image){
        this.context.drawImage(image, 0, 0);
    }
}