/**
 * Created by mhinz on 5/22/2016.
 */


export class ShapeDetector {

    constructor(private threshold: any) {
        if (this.threshold || this.threshold === 0) {
            this.threshold = 20;
        }
    }

    detect(src: any, key: any, width: number, height: number): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;

            image.onload = () => {
                if (!width) {
                    width = image.width;
                }
                if (!height) {
                    height = image.height;
                }
                resolve(this.doDetect(image, key, width, height));
            };
        });
        return promise;
    };

    doDetect(image: any, key: any, width: number, height: number) {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        //prepare
        let canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image, 0, 0, width, height);
        return {image, key, canvas};
    }

}
