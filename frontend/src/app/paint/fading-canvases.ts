import { PositionedPaintableCanvas, PaintedCanvas } from ".";

export class FadingCanvases {

    private painteds : PaintedCanvas[] = [];
    private alpha : number = 0.0;
    private readonly maxAlpha = 0.9;
    private readonly minAlpha = 0.1;
    

    constructor(private images: PositionedPaintableCanvas[], private fadeInTimeMillis: number, private fadeOutTimeMillis: number, private context: CanvasRenderingContext2D) { }

    public start() : void {
        const started = (new Date).getTime();
        const that = this;
        window.requestAnimationFrame(function(){that.animate(that, started)});            

    }
    private animate(instance : FadingCanvases, started : number) : void{
        const now = (new Date).getTime();
        const timeRunning = now - started;

        //cleanup last painted images --> to be drawn newly
        for (const painted of instance.painteds) {
            painted.clear();
        }
        //reset canvas cache 
        instance.painteds = [];
        
        //total time expired --> end this animation: just go away
        const totalTime = instance.fadeInTimeMillis + instance.fadeOutTimeMillis;
        if(timeRunning >= totalTime){
            return;
        }
        //calculate new alpha
        if(timeRunning < instance.fadeInTimeMillis){
            const remaingFadeIn = instance.fadeInTimeMillis - timeRunning;
            const remaingAlpha = instance.maxAlpha - instance.alpha;
            const add = remaingAlpha / remaingFadeIn * 10;
            instance.alpha = instance.alpha + add;
            // console.log('fading in:' + instance.alpha);
            
        }
        if(timeRunning >= instance.fadeInTimeMillis){
            
            const remaingFadeOut = instance.fadeOutTimeMillis - (timeRunning - instance.fadeInTimeMillis);
            const remaingAlpha = instance.minAlpha - instance.alpha;
            const add = remaingAlpha / remaingFadeOut * 10;
            instance.alpha = instance.alpha + add;
            // console.log('fading in:' + instance.alpha);
            
        }
        //set new alpha
        instance.context.globalAlpha = instance.alpha;
        //paint with new alpha
        for (const image of instance.images) {
            instance.painteds.push(new PaintedCanvas('some', image.position.x, image.position.y, image.paintableCanvas, instance.context));    
        }
        window.requestAnimationFrame(function(){instance.animate(instance, started)});
    }


}
