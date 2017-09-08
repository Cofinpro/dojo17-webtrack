/**
 * Created by mhinz on 5/24/2016.
 */
import { Direction } from '../move/direction';

export class ShapeData {

    direction: Direction = new Direction();
    lines: any[];
    columns: any[];
    
    constructor(private width, private height) {
        this.width = width;
        this.height = height;
        
        this.lines = new Array(height);
        this.columns = new Array(width);
    }
    
    addDot(colNumber: number, lineNumber: number) {
        this.computeLine(colNumber, lineNumber);
        this.computeColumn(colNumber, lineNumber);
    };

    computeLine(colNumber: number, lineNumber: number) {
        let line = this.lines[lineNumber];
        //no entry for the line --> create one!
        if (!line) {
            line = {mostLeft: colNumber, mostRight: colNumber};
            line.dots = [];
            line.dots.push({start: colNumber, end: colNumber});
            this.lines[lineNumber] = line;
            return;
        }
        let i;
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

    computeColumn(colNumber: number, lineNumber: number) {
        let column = this.columns[colNumber];
        if (!column) {
            column = {mostTop: lineNumber, mostBottom: lineNumber};
            column.dots = [];
            column.dots.push({start: lineNumber, end: lineNumber});
            this.columns[colNumber] = column;
            return;
        }
        let i;
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
    }

    getLeftLineResidual(lineNumber: number) {
        let line = this.lines[lineNumber];
        if (!line)return this.width;
        return line.mostLeft - 1;
    }

    getRightLineResidual(lineNumber: number) {
        let line = this.lines[lineNumber];
        if (!line)return this.width;
        return this.width - line.mostRight - 1;
    }

    getTopColumnResidual(columnNumber: number) {
        let column = this.columns[columnNumber];
        if (!column)return this.height;
        return column.mostTop - 1;
    }

    getBottomColumnResidual(columnNumber: number) {
        let column = this.columns[columnNumber];
        if (!column)return this.height;
        return this.height - column.mostBottom - 1;
    }

    collisionCorrection = function (other: any, loopData: any, direction: any): any {
        
        let i;
        let buffer;
        let returned: any = {};
        let thisPart;
        let otherPart;
        let min = Number.POSITIVE_INFINITY;
        if (direction === this.direction.right) {
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
        if (direction === this.direction.left) {
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
    
        if (direction === this.direction.down) {
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
        if (direction === this.direction.up) {
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
    }

    vrtCollisionCorrection(other, correctionData) {
    
        let hrzDir = correctionData.horizontal.direction;
        let vrtDir = correctionData.vertical.direction;
    
        let hrz = correctionData.horizontal.overlap;
    
        let thisHrzLoopStart = 0;
        let otherHrzLoopStart = 0;
    
        if (hrzDir === this.direction.left) {
            if (hrz >= other.width) {
                thisHrzLoopStart = hrz - other.width;
                hrz = other.width;
            } else {
                otherHrzLoopStart = other.width - hrz;
            }
        }
        if (hrzDir === this.direction.right) {
            thisHrzLoopStart = this.width - hrz;
            if (hrz > other.width) hrz = other.width;
        }
    
        let i;
        let pixelToMove = Number.POSITIVE_INFINITY;
        for (i = 0; i < hrz; i++) {
            let m;
            if (vrtDir === this.direction.up) {
                m = this.getTopColumnResidual(thisHrzLoopStart + i) + other.getBottomColumnResidual(otherHrzLoopStart + i);
            } else {
                m = other.getBottomColumnResidual(otherHrzLoopStart + i) + this.getTopColumnResidual(thisHrzLoopStart + i);
            }
            if (m < pixelToMove)pixelToMove = m;
        }
        return pixelToMove;
    
    }

    collidesRightLeft(other, relPosition, direction) {
    
        if (direction === this.direction.right && relPosition.left < 0) return false;
        if (direction === this.direction.left && relPosition.left > 0) return false;
    
        let overlap;
        if (direction === this.direction.right) overlap = other.width - relPosition.left;
        if (direction === this.direction.left) overlap = this.width + relPosition.left;
    
        //if(direction == Direction.right && collisionCorrection < 0) return false;
        //if(direction == Direction.left && collisionCorrection < 0) return false;
    
        let otherTopStart;
        let thisTopStart;
        let vrtCount;
        let pixelToMove;
        let residual;
        let maxOverlap = 0;
    
    
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
        let i;
    
        for (i = 0; i <= vrtCount; i++) {
    
            if (direction === this.direction.left) pixelToMove = this.getRightLineResidual(thisTopStart + i) + other.getLeftLineResidual(otherTopStart + i);
            if (direction === this.direction.right) pixelToMove = this.getLeftLineResidual(thisTopStart + i) + other.getRightLineResidual(otherTopStart + i);
    
            residual = pixelToMove - Math.abs(overlap);
            if (direction === this.direction.right)if (residual < maxOverlap)maxOverlap = residual;
            if (direction === this.direction.left)if (residual < maxOverlap)maxOverlap = residual;
    
        }
        if (maxOverlap == 0)return false;
        return {top: null, left: maxOverlap};
    
    
    }

    collidesUpDown(other: any, relPosition: any, direction: any) {
    
        if (direction === this.direction.down && relPosition.top < 0) return false;
        if (direction === this.direction.up && relPosition.top > 0) return false;
    
        let overlap;
        if (direction === this.direction.down) overlap = other.height - relPosition.top;
        if (direction === this.direction.up) overlap = this.height + relPosition.top;
    
        let otherLeftStart;
        let thisLeftStart;
        let hrzCount;
        let pixelToMove;
        let residual;
        let maxOverlap = 0;
    
    
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
        if (direction === this.direction.down) return this.collidesDown(other, relPosition, otherLeftStart, thisLeftStart, hrzCount);
        if (direction === this.direction.up) return this.collidesUp(other, relPosition, otherLeftStart, thisLeftStart, hrzCount);
    }
    
    collidesDown(other, relPosition, otherLeftStart, thisLeftStart, hrzCount) {
    
        let overlap = other.height - relPosition.top;
        let pixelToMove;
        let residual;
        let maxOverlap = 0;
        let i;
        for (i = 0; i <= hrzCount; i++) {
            pixelToMove = this.getTopColumnResidual(thisLeftStart + i) + other.getBottomColumnResidual(otherLeftStart + i);
            residual = pixelToMove - Math.abs(overlap);
            if (residual < maxOverlap)maxOverlap = residual;
        }
        if (maxOverlap == 0)return false;
        return {top: maxOverlap, left: null};
    }

    collidesUp(other, relPosition, otherLeftStart, thisLeftStart, hrzCount) {
        let overlap = this.height + relPosition.top;
        let pixelToMove;
        let residual;
        let maxOverlap = 0;
        let i;
        for (i = 0; i <= hrzCount; i++) {
            pixelToMove = this.getBottomColumnResidual(thisLeftStart + i) + other.getTopColumnResidual(otherLeftStart + i);
            residual = pixelToMove - Math.abs(overlap);
            if (residual < maxOverlap) {
                maxOverlap = residual;
            }
        }
        if (maxOverlap == 0)return false;
        return {top: maxOverlap, left: null};
    }

}

