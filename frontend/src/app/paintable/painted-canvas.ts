import { PaintableCanvas } from './paintable-canvas';

export class PaintedCanvas {
    id;
    top : number;
    left : number;
    width: number;
    height: number;
    right : number = this.left + this.width;
    bottom : number = this.top + this.height;

    constructor(id, elmTop : number, elmLeft : number, public paintableCanvas : PaintableCanvas, private context: any) {

        this.id = id;
        this.context = context;


        this.top = elmTop;
        this.left = elmLeft;
        this.height = paintableCanvas.height;
        this.width = paintableCanvas.width;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;

        this.placeTag();
    }

    setPosition(top, left) : void {
        this.clear();
        this.top = top;
        this.left = left;
 
         this.placeTag();
     }
 

    placeTag() {
        this.context.fillStyle = 'rgba(0,0,0,0.0)';
        this.context.fillRect(this.left,this.top,this.width, this.height);
        this.context.drawImage(this.paintableCanvas.canvas, this.left, this.top);
    };

    setImage(image: PaintableCanvas) {
        this.paintableCanvas = image;
    };

    clear() : void {
        this.context.clearRect(this.left, this.top, this.width, this.height);
    }

}
