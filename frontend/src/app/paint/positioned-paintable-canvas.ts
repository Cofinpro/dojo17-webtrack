import { PaintableCanvas } from './paintable-canvas';
import { Position } from '../shared/position';

export class PositionedPaintableCanvas  {

    constructor(public paintableCanvas : PaintableCanvas, public position : Position) {
    }


}
