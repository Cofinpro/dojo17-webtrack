/**
 * Created by mhinz on 5/26/2016.
 */
export class PaintableCanvas {

 
    constructor(public canvas: HTMLCanvasElement, public width: number, public height: number) {
    }

    public addOverlay(overlay: PaintableCanvas, left : number, top :number) : void{
        this.canvas.getContext('2d').drawImage(overlay.canvas,left,top);
    }


}

