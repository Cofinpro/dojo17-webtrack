/**
 * Created by mhinz on 5/22/2016.
 * 
 * this class converts a given image to a canvas object that can be painted fastly on a given parent canvas.
 */


export class Image2Canvas {


    static detect(src: string, key: string, width: number, height: number): Promise<HTMLCanvasElement> {
        let promise = new Promise<HTMLCanvasElement>((resolve, reject) => {
            const image = new Image();
            image.src = src;

            image.onload = () => {
                if (!width) {
                    width = image.width;
                }
                if (!height) {
                    height = image.height;
                }
                resolve(Image2Canvas.doDetect(image, key, width, height));
            };
        });
        return promise;
    };

    static doDetect(image: HTMLImageElement, key: string, width: number, height: number) {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        let canvasContext = canvas.getContext('2d');
        
        canvasContext.drawImage(image, 0, 0, width, height);
        return canvas;
    }

}
