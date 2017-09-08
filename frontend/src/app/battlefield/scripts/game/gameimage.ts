/**
 * Created by mhinz on 5/26/2016.
 */
export class GameImage {

    shape: any = null;
    canvas: any = null;

    constructor(
            public src: any, 
            public width: number,
            public height: number) {
        // FIXME: handle 
        // this.width = width ? width : image.width;
        // this.height = height ? height : image.height;
    }

    getImageSource(): any {
        return this.src;
    }

    setImageData(shape: any, canvas: any): void {
        this.shape = shape;
        this.canvas = canvas;
    }

    getShape(): any {
        return this.shape;
    }
}

