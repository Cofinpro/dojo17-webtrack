import { AbstractGameElement } from './abstractgameelement';

export class GEPicture extends AbstractGameElement {
    context;
    gameImage;
    height;
    width;
    top;
    left;
    right;
    bottom;
    shapeData;

    constructor(elmTop, elmLeft, gameImage, context) {
        super();

        this.context = context;
        this.gameImage = gameImage;

        this.height = gameImage.height;
        this.width = gameImage.width;
        this.top = elmTop;
        this.left = elmLeft;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;

        this.shapeData = gameImage.getShape();
        this.placeTag();
    }

    placeTag = () => {
        this.context.fillStyle = 'rgba(0,0,0,0.0)';
        this.context.fillRect(this.left,this.top,this.width, this.height);
        this.context.drawImage(this.gameImage.canvas, this.left, this.top);
    };

    setImage = (image) => {
        this.gameImage = image;
        this.shapeData = this.gameImage.getShape();
    };

    getLeft = (row) => {
        return this.left + this.shapeData.getLeftLineResidual(row);
    };

    getRight = (row) => {
        return this.right - this.shapeData.getRightLineResidual(row);
    };

    getTop = (col) => {
        return this.top + this.shapeData.getTopColumnResidual(col);
    };

    getBottom = (col) => {
        return this.bottom - this.shapeData.getBottomColumnResidual(col);
    };
}
