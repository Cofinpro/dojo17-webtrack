/**
 * Created by mhinz on 5/24/2016.
 */
function ShapeData(width, height) {

    this.width = width;
    this.height = height;

    this.lines = new Array(height);
    this.columns = new Array(width);
}
ShapeData.prototype.addDot = function (colNumber, lineNumber) {
    this.computeLine(colNumber, lineNumber);
    this.computeColumn(colNumber, lineNumber);
};
ShapeData.prototype.computeLine = function (colNumber, lineNumber) {
    var line = this.lines[lineNumber];
    //no entry for the line --> create one!
    if (!line) {
        line = {mostLeft: colNumber, mostRight: colNumber};
        line.dots = [];
        line.dots.push({start: colNumber, end: colNumber});
        this.lines[lineNumber] = line;
        return;
    }
    var i;
    //update given an existing entry of that line
    for (i = 0; i < line.dots.length; i++) {
        if (line.dots[i].start - 1 == colNumber) {
            line.dots[i].start = colNumber;
            line.mostLeft = colNumber;
            return;
        }
        if (line.dots[i].end + 1 == colNumber) {
            line.dots[i].end = colNumber;
            line.mostRight = colNumber;
            return;
        }
    }
    //add a new entry for this line
    line.dots.push({start: colNumber, end: colNumber});
    if (line.mostLeft > colNumber) line.mostLeft = colNumber;
    if (line.mostRight < colNumber) line.mostRight = colNumber;
};
ShapeData.prototype.computeColumn = function (colNumber, lineNumber) {
    var column = this.columns[colNumber];
    if (!column) {
        column = {mostTop: lineNumber, mostBottom: lineNumber};
        column.dots = [];
        column.dots.push({start: lineNumber, end: lineNumber});
        this.columns[colNumber] = column;
        return;
    }
    var i;
    for (i = 0; i < column.dots.length; i++) {
        if (column.dots[i].start - 1 == lineNumber) {
            column.dots[i].start = lineNumber;
            column.mostTop = lineNumber;
            return;
        }
        if (column.dots[i].end + 1 == lineNumber) {
            column.dots[i].end = lineNumber;
            column.mostBottom = lineNumber;
            return;
        }
    }
    column.dots.push({start: lineNumber, end: lineNumber});
    if (column.mostTop > lineNumber) column.mostTop = lineNumber;
    if (column.mostBottom < lineNumber) column.mostBottom = lineNumber;
};
ShapeData.prototype.getLeftLineResidual = function (lineNumber) {
    var line = this.lines[lineNumber];
    if (!line)return this.width;
    return line.mostLeft - 1;
};
ShapeData.prototype.getRightLineResidual = function (lineNumber) {
    var line = this.lines[lineNumber];
    if (!line)return this.width;
    return this.width - line.mostRight - 1;
};
ShapeData.prototype.getTopColumnResidual = function (columnNumber) {
    var column = this.columns[columnNumber];
    if (!column)return this.height;
    return column.mostTop - 1;
};
ShapeData.prototype.getBottomColumnResidual = function (columnNumber) {
    var column = this.columns[columnNumber];
    if (!column)return this.height;
    return this.height - column.mostBottom - 1;
};

ShapeData.prototype.collisionCorrection = function (other, loopData, direction) {

    var i;
    var buffer;
    var returned = {};
    var thisPart;
    var otherPart;
    var min = Number.POSITIVE_INFINITY;
    if (direction == Direction.right) {
        for (i = 0; i < loopData.lines; i++) {
            thisPart = this.getRightLineResidual(loopData.thisStart + i);
            otherPart = other.getLeftLineResidual(loopData.otherStart + i);
            buffer = thisPart + otherPart;
            if(buffer < min){
                min = buffer;
                returned.thisPart = thisPart;
                returned.otherPart = otherPart;
                returned.line = min;
            }
        }
        return returned;
    }
    if (direction == Direction.left) {
        for (i = 0; i < loopData.lines; i++) {
            thisPart = this.getLeftLineResidual(loopData.thisStart + i);
            otherPart = other.getRightLineResidual(loopData.otherStart + i);
            buffer = thisPart + otherPart;
            if(buffer < min){
                min = buffer;
                returned.thisPart = thisPart;
                returned.otherPart = otherPart;
                returned.line = min;
            }
        }
        return returned;
    }

    if (direction == Direction.down) {
        for (i = 0; i < loopData.lines; i++) {
            thisPart = this.getBottomColumnResidual(loopData.thisStart + i);
            otherPart = other.getTopColumnResidual(loopData.otherStart + i);
            buffer = thisPart + otherPart;
            if(buffer < min){
                min = buffer;
                returned.thisPart = thisPart;
                returned.otherPart = otherPart;
                returned.line = min;
            }
        }
        return returned;
    }
    if (direction == Direction.up) {
        for (i = 0; i < loopData.lines; i++) {
            thisPart = this.getTopColumnResidual(loopData.thisStart + i);
            otherPart = other.getBottomColumnResidual(loopData.otherStart + i);
            buffer = thisPart + otherPart;
            if(buffer < min){
                min = buffer;
                returned.thisPart = thisPart;
                returned.otherPart = otherPart;
                returned.line = min;
            }
        }
        return returned;
    }
};
ShapeData.prototype.vrtCollisionCorrection = function (other, correctionData) {

    var hrzDir = correctionData.horizontal.direction;
    var vrtDir = correctionData.vertical.direction;

    var hrz = correctionData.horizontal.overlap;

    var thisHrzLoopStart = 0;
    var otherHrzLoopStart = 0;

    if (hrzDir == Direction.left) {
        if (hrz >= other.width) {
            thisHrzLoopStart = hrz - other.width;
            hrz = other.width;
        } else {
            otherHrzLoopStart = other.width - hrz;
        }
    }
    if (hrzDir == Direction.right) {
        thisHrzLoopStart = this.width - hrz;
        if (hrz > other.width) hrz = other.width;
    }

    var i;
    var pixelToMove = Number.POSITIVE_INFINITY;
    for (i = 0; i < hrz; i++) {
        var m;
        if (vrtDir == Direction.up) {
            m = this.getTopColumnResidual(thisHrzLoopStart + i) + other.getBottomColumnResidual(otherHrzLoopStart + i);
        } else {
            m = other.getBottomColumnResidual(otherHrzLoopStart + i) + this.getTopColumnResidual(thisHrzLoopStart + i);
        }
        if (m < pixelToMove)pixelToMove = m;
    }
    return pixelToMove;

};
ShapeData.prototype.collidesRightLeft = function (other, relPosition, direction) {

    if (direction == Direction.right && relPosition.left < 0) return false;
    if (direction == Direction.left && relPosition.left > 0) return false;

    var overlap;
    if (direction == Direction.right) overlap = other.width - relPosition.left;
    if (direction == Direction.left) overlap = this.width + relPosition.left;

    //if(direction == Direction.right && collisionCorrection < 0) return false;
    //if(direction == Direction.left && collisionCorrection < 0) return false;

    var otherTopStart;
    var thisTopStart;
    var vrtCount;
    var pixelToMove;
    var residual;
    var maxOverlap = 0;


    if (relPosition.top <= 0) {
        otherTopStart = 0;
        thisTopStart = Math.abs(relPosition.top);

        vrtCount = this.height - thisTopStart;
        if (vrtCount > other.height) vrtCount = other.height;

    } else {
        otherTopStart = relPosition.top;
        thisTopStart = 0;

        vrtCount = other.height - otherTopStart;
        if (vrtCount > this.height) vrtCount = this.height;
    }
    var i;

    for (i = 0; i <= vrtCount; i++) {

        if (direction == Direction.left) pixelToMove = this.getRightLineResidual(thisTopStart + i) + other.getLeftLineResidual(otherTopStart + i);
        if (direction == Direction.right) pixelToMove = this.getLeftLineResidual(thisTopStart + i) + other.getRightLineResidual(otherTopStart + i);

        residual = pixelToMove - Math.abs(overlap);
        if (direction == Direction.right)if (residual < maxOverlap)maxOverlap = residual;
        if (direction == Direction.left)if (residual < maxOverlap)maxOverlap = residual;

    }
    if (maxOverlap == 0)return false;
    return {top: null, left: maxOverlap};


};
ShapeData.prototype.collidesUpDown = function (other, relPosition, direction) {

    if (direction == Direction.down && relPosition.top < 0) return false;
    if (direction == Direction.up && relPosition.top > 0) return false;

    var overlap;
    if (direction == Direction.down) overlap = other.height - relPosition.top;
    if (direction == Direction.up) overlap = this.height + relPosition.top;

    var otherLeftStart;
    var thisLeftStart;
    var hrzCount;
    var pixelToMove;
    var residual;
    var maxOverlap = 0;


    if (relPosition.left <= 0) {
        otherLeftStart = 0;
        thisLeftStart = Math.abs(relPosition.left);

        hrzCount = this.width - thisLeftStart;
        if (hrzCount > other.width) hrzCount = other.width;

    } else {
        otherLeftStart = relPosition.left;
        thisLeftStart = 0;

        hrzCount = other.width - otherLeftStart;
        if (hrzCount > this.width) hrzCount = this.width;
    }
    if (direction == Direction.down) return this.collidesDown(other, relPosition, otherLeftStart, thisLeftStart, hrzCount);
    if (direction == Direction.up) return this.collidesUp(other, relPosition, otherLeftStart, thisLeftStart, hrzCount);
};

ShapeData.prototype.collidesDown = function (other, relPosition, otherLeftStart, thisLeftStart, hrzCount) {

    var overlap = other.height - relPosition.top;
    var pixelToMove;
    var residual;
    var maxOverlap = 0;
    var i;
    for (i = 0; i <= hrzCount; i++) {
        pixelToMove = this.getTopColumnResidual(thisLeftStart + i) + other.getBottomColumnResidual(otherLeftStart + i);
        residual = pixelToMove - Math.abs(overlap);
        if (residual < maxOverlap)maxOverlap = residual;
    }
    if (maxOverlap == 0)return false;
    return {top: maxOverlap, left: null};
};
ShapeData.prototype.collidesUp = function (other, relPosition, otherLeftStart, thisLeftStart, hrzCount) {
    var overlap = this.height + relPosition.top;
    var pixelToMove;
    var residual;
    var maxOverlap = 0;
    var i;
    for (i = 0; i <= hrzCount; i++) {
        pixelToMove = this.getBottomColumnResidual(thisLeftStart + i) + other.getTopColumnResidual(otherLeftStart + i);
        residual = pixelToMove - Math.abs(overlap);
        if (residual < maxOverlap) {
            maxOverlap = residual;
        }
    }
    if (maxOverlap == 0)return false;
    return {top: maxOverlap, left: null};
};
