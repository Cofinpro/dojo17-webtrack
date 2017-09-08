/**
 * Created by mhinz on 5/22/2016.
 */
import { ShapeData } from './shapedata';


export class ShapeDetector {

    constructor(private threshold: any) {
        if (this.threshold || this.threshold === 0) {
            this.threshold = 20;
        }
    }

    detect(src: any, key: any, callBack: () => any, width: number, height: number) {
        const image = new Image();
        image.onload = () => {
            if (!width) {
                width = image.width;
            }
            if (!height) {
                height = image.height;
            }
            this.doDetect(image, key, callBack, width, height);
        };
        image.src = src;
        return src;
    };

    doDetect(image: any, key: any, callBack: (key, shapeData, canvas) => any, width: number, height: number) {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        //prepare
        let canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image, 0, 0, width, height);
        //read lines
        let shapeData = new ShapeData(width, height);
        let i;
        let j;
        for (i = 0; i < height; i++) {
            let imageData = canvasContext.getImageData(0, i, width, 1);
            let lineData = this.scanLine(imageData.data);

            for(j = 0; j < lineData.length; j++){
                if(lineData[j] >= this.threshold){
                    shapeData.addDot(j, i);
                }
            }
        }
        callBack(key, shapeData, canvas);
    }

    scanLine(data: any): any[] {
        let returned = [];
        let i;
        let count = 0;
        for (i = 0; i < data.length; i += 4) {
            returned[count] = data[i + 3];
            count++;
        }
        return returned;
    };
}
