function AbstractGameElement() {

    this.proposedPosition = null;

    this.placeTag = function () {

        //this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.fillRect(this.left, this.top, this.width, this.height);
        //this.context.closePath();
        this.context.fill();
    };

    this.setPosition = function (top, left) {
        this.clear();
        this.top = top;
        this.left = left;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;

        this.placeTag();
    };

    this.setBackgroundColor = function (color) {
        this.color = color;
        this.clear();
        this.placeTag();
    };

    this.clear = function () {
        this.context.clearRect(this.left, this.top, this.width, this.height);
    };

    this.collisionCorrection = function (obstacles, move) {

        var hrzTarget = this.left + move.horizontal;
        var vrtTarget = this.top + move.vertical;

        var returned = {left: hrzTarget, top: vrtTarget};

        var overlapped = this.getOverlappedElements(obstacles, hrzTarget, vrtTarget);

        if (overlapped.length == 0)return returned;

        //if (!(this.shapeData && overlapped[0].shapeData))return this.correctBoxedBased(move, overlapped, returned);
        return this.correctBoxedBased(move, overlapped, returned);

        var i;
        var j;
        var buffer;
        var buffer2;
        var hrzMinResult;
        var vrtMinResult;
        //FIXME remove console log
        console.log('start');
        for (i = 0; i < overlapped.length; i++) {
            var hrzCorrection = this.checkHrz(move, overlapped[i]);
            var vrtCorrection = this.checkVrt(move, overlapped[i]);
            if (!vrtCorrection && !hrzCorrection)continue;

            var hrzOverlap = -1;
            var vrtOverlap = -1;
            var pixelsToMove;
            var shapeResult;
            if (hrzCorrection) {
                //positive values for 'right', negative values for 'left'
                if (move.horizontal > 0) {
                    hrzOverlap = this.right - overlapped[i].left;
                    for (j = 0; j < hrzCorrection.lines; j++) {
                        buffer = this.getRight(hrzCorrection.thisStart + j) + move.horizontal;
                        buffer2 = overlapped[i].getLeft(hrzCorrection.otherStart + j);
                        if (buffer > buffer2) {
                            returned.hrzCollission = true;
                            returned.left = buffer2 - this.width;
                        }

                    }
                    //
                    //if (hrzOverlap >= 0) {
                    //    shapeResult = this.shapeData.collisionCorrection(overlapped[i].shapeData, hrzCorrection, Direction.right);
                    //    pixelsToMove = shapeResult.line - hrzOverlap;
                    //    if (pixelsToMove < move.horizontal) {
                    //        if (!hrzMinResult || pixelsToMove < hrzMinResult) {
                    //            hrzMinResult = pixelsToMove;
                    //        }
                    //    }
                    //}
                }

                if (move.horizontal < 0) {
                    hrzOverlap = this.left - overlapped[i].right;
                    for (j = 0; j < hrzCorrection.lines; j++) {
                        buffer = this.getLeft(hrzCorrection.thisStart + j) + move.horizontal;
                        buffer2 = overlapped[i].getRight(hrzCorrection.otherStart + j);
                        if (buffer < buffer2) {
                            returned.hrzCollission = true;
                            returned.left = buffer2;
                        }

                    }
                    //if(hrzOverlap <= 0){
                    //    shapeResult = this.shapeData.collisionCorrection(overlapped[i].shapeData, hrzCorrection, Direction.left);
                    //    pixelsToMove = (shapeResult.line * -1) - hrzOverlap;
                    //    if (pixelsToMove > move.horizontal) {
                    //        if (!hrzMinResult || pixelsToMove > hrzMinResult) {
                    //            hrzMinResult = pixelsToMove;
                    //        }
                    //    }
                    //}
                }
            }

            if (vrtCorrection) {
                //positive values for 'down', negative values for 'up'
                if (move.vertical > 0) {
                    vrtOverlap = this.bottom - overlapped[i].top;
                    for (j = 0; j < vrtCorrection.lines; j++) {
                        buffer = this.getBottom(vrtCorrection.thisStart + j) + move.vertical;
                        buffer2 = overlapped[i].getTop(vrtCorrection.otherStart + j);
                        //FIXME remove console log
                        console.log('buffer :: ' + j + ' ... ' + buffer + ' --> buffer2 :: ' + buffer2);
                        var b = buffer - buffer2;


                        if (buffer > buffer2 && b > 0) {
                            //FIXME remove console log
                            console.log('collide');
                            returned.vrtCollission = true;
                            returned.top = buffer2 - this.height;
                        }
                    }

                    //if (vrtOverlap >= 0) {
                    //    shapeResult = this.shapeData.collisionCorrection(overlapped[i].shapeData, vrtCorrection, Direction.down);
                    //    pixelsToMove = shapeResult.line - vrtOverlap;
                    //    if (pixelsToMove < move.vertical && pixelsToMove >=0) {
                    //        if (!vrtMinResult || pixelsToMove < vrtMinResult) {
                    //            vrtMinResult = pixelsToMove;
                    //        }
                    //    }
                    //}
                }

                if (move.vertical < 0) {
                    vrtOverlap = this.top - overlapped[i].bottom;
                    for (j = 0; j < vrtCorrection.lines; j++) {
                        buffer = this.getTop(vrtCorrection.thisStart + j) + move.vertical;
                        buffer2 = overlapped[i].getTop(vrtCorrection.otherStart + j);


                        if (buffer < buffer2) {
                            returned.vrtCollission = true;
                            returned.top = buffer2;
                        }

                    }
                    //if (vrtOverlap <= 0) {
                    //    shapeResult = this.shapeData.collisionCorrection(overlapped[i].shapeData, vrtCorrection, Direction.up);
                    //    pixelsToMove = (shapeResult.line * -1) - vrtOverlap;
                    //    if (pixelsToMove > move.vertical && pixelsToMove <= 0) {
                    //        if (!vrtMinResult || pixelsToMove > vrtMinResult) {
                    //            vrtMinResult = pixelsToMove;
                    //        }
                    //    }
                    //}
                }
            }
        }
        //if (vrtMinResult || vrtMinResult == 0) {
        //    returned.vrtCollission = true;
        //    if (move.vertical < 0 && vrtMinResult <= 0)returned.top = this.top + vrtMinResult;
        //    if (move.vertical > 0 && vrtMinResult >= 0)returned.top = this.top + vrtMinResult;
        //
        //}
        //if (hrzMinResult || hrzMinResult == 0) {
        //    returned.hrzCollission = true;
        //    if (move.horizontal < 0 && hrzMinResult <= 0)returned.left = this.left + hrzMinResult;
        //    if (move.horizontal > 0 && hrzMinResult >= 0)returned.left = this.left + hrzMinResult;
        //}
        //FIXME remove console log
        console.log('stop');
        //FIXME remove console log
        console.log(returned);
        return returned;
    };

    this.correctBoxedBased = function (move, overlapped, returned) {
        var i;
        for (i = 0; i < overlapped.length; i++) {
            var hrzCorrection = this.checkHrz(move, overlapped[i]);
            var vrtCorrection = this.checkVrt(move, overlapped[i]);
            if (!vrtCorrection && !hrzCorrection) continue;
            if (hrzCorrection) {
                returned.left = this.getBoxHrzPosition(move, overlapped[i]);
                returned.hrzCollission = true;
            }
            if (vrtCorrection) {
                returned.top = this.getBoxVrtPosition(move, overlapped[i]);
                returned.vrtCollission = true;
            }
        }
        return returned;

    };

    this.checkHrz = function (move, element) {

        if (move.horizontal == 0) return false;

        if (this.bottom <= element.top) return false;
        if (this.top >= element.bottom) return false;

        var dif;
        if (this.top <= element.top) {
            dif = element.top - this.top;
            var lines = this.height - dif;
            //special case --> this is larger than element
            if (this.bottom >= element.bottom) {
                lines = element.height;
            }
            return {thisStart: dif, otherStart: 0, lines: lines};
        }

        if (this.bottom <= element.bottom) {
            return {thisStart: 0, otherStart: this.top - element.top, lines: this.height};
        }

        dif = element.bottom - this.top;
        return {thisStart: 0, otherStart: element.height - dif, lines: dif};
    };
    this.checkVrt = function (move, element) {

        if (move.vertical == 0) return false;

        if (this.right <= element.left) return false;
        if (this.left >= element.right) return false;

        var dif;
        if (this.left <= element.left) {
            dif = element.left - this.left;
            var lines = this.width - dif;
            //special case --> this is larger than element
            if (this.right >= element.right) {
                lines = element.width;
            }
            return {thisStart: dif, otherStart: 0, lines: lines};
        }

        if (this.right <= element.right) {
            return {thisStart: 0, otherStart: this.left - element.left, lines: this.height};
        }

        dif = element.right - this.left;
        return {thisStart: 0, otherStart: element.width - dif, lines: dif};
    };
    this.getBoxHrzPosition = function (move, element) {
        if (move.horizontal < 0 && element.right >= this.left + move.horizontal) {
            return element.right;
        }
        if (move.horizontal > 0 && element.left <= this.right + move.horizontal) {
            return element.left - this.width;
        }
    };
    this.getBoxVrtPosition = function (move, element) {
        if (move.vertical < 0 && element.bottom >= this.top + move.vertical) {
            return element.bottom;
        }
        if (move.vertical > 0 && element.top <= this.bottom + move.vertical) {
            return element.top - this.height;
        }
    };

    this.getOverlappedElements = function (elements, hrzTarget, vrtTarget) {

        var vrtBottom = vrtTarget + this.height;
        var hrzRight = hrzTarget + this.width;

        var i;
        var overlapped = [];

        for (i = 0; i < elements.length; i++) {
            if (elements[i] == this)continue;
            //above or under
            if (elements[i].top > vrtBottom) continue;
            if (vrtTarget > elements[i].bottom) continue;
            //to the right or to the left
            if (elements[i].left > hrzRight) continue;
            if (hrzTarget > elements[i].right) continue;

            overlapped.push(elements[i]);
        }
        return overlapped;
    };


    //FIXME check inheritance of AbstractGameElement
    this.checkPixels = function () {
    };
}

AbstractGameElement.baseFormRect = 'RECT';
AbstractGameElement.baseFormCircle = 'CIRCLE';
AbstractGameElement.baseFormPicture = 'PICTURE';