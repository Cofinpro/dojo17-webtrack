import { PaintableCanvas } from './paintable-canvas';

export class PaintedCanvas {

    constructor(private id, private elmLeft : number, private elmTop : number, private paintableCanvas : PaintableCanvas, private context: CanvasRenderingContext2D) {
        this.placeTag();
    }

    placeTag() {
        this.context.fillStyle = 'rgba(0,0,0,0.0)';
        this.context.fillRect(this.elmLeft,this.elmTop,this.paintableCanvas.width, this.paintableCanvas.height);
        this.context.drawImage(this.paintableCanvas.canvas, this.elmLeft, this.elmTop);
    };

    clear() : void {
        this.context.clearRect(this.elmLeft, this.elmTop, this.paintableCanvas.width, this.paintableCanvas.height);
    }

}
