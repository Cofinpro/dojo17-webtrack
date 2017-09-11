export class AbstractGameElement {

    public baseFormRect = 'RECT';
    public baseFormCircle = 'CIRCLE';
    public baseFormPicture = 'PICTURE';

    proposedPosition = null;
    context: any;
    top: any;
    left;
    right;
    bottom;
    color;
    width;
    height;

    placeTag() : void {

        //this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.left, this.top, this.width, this.height);
        //this.context.closePath();
        this.context.fill();
    }

    setPosition(top, left) : void {
       this.clear();
       this.top = top;
       this.left = left;
       this.right = this.left + this.width;
       this.bottom = this.top + this.height;

        this.placeTag();
    }

    setBackgroundColor(color) : void  {
        this.color = color;
        this.clear();
        this.placeTag();
    }

    clear() : void {
        this.context.clearRect(this.left, this.top, this.width, this.height);
    }

    
}

