import { AbstractGameElement } from './abstractgameelement';

export class GEPicture extends AbstractGameElement {
    id;
    context;
    gameImage;
    height : number;
    width : number;
    top : number;
    left : number;
    right : number;
    bottom : number;

    constructor(id, elmTop : number, elmLeft : number, gameImage, context) {
        super();

        this.id = id;
        this.context = context;
        this.gameImage = gameImage;

        this.height = gameImage.height;
        this.width = gameImage.width;

        this.top = elmTop;
        this.left = elmLeft;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;

        this.placeTag();
    }

    placeTag() {
        this.context.fillStyle = 'rgba(0,0,0,0.0)';
        this.context.fillRect(this.left,this.top,this.width, this.height);
        this.context.drawImage(this.gameImage.canvas, this.left, this.top);
    };

    setImage(image) {
        this.gameImage = image;
    };

    getLeft() : number {
        return this.left;
    };

    getRight() : number {
        return this.right;
    };

    getTop() : number {
        return this.top;
    };

    getBottom() : number {
        return this.bottom;
    };
}
