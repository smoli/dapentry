import {BoundingBox, GrObject, ObjectType} from "./GrObject";

export class GrCanvas extends GrObject {
    private _width: number;
    private _height: number;

    constructor(x1: number, y1: number, width: number, height: number) {

        const x = (width - x1) / 2 + x1;
        const y = (height - y1) / 2 + y1;

        super(ObjectType.Canvas, "Canvas", x, y);

        this._width = width;
        this._height = height;
    }

    protected copy(): GrObject {
        throw new Error("GrObject.copy: You cannot copy the canvas");
    }

    get boundingBox(): BoundingBox {
        return {x: this.x, y: this.y, w: this._width, h: this._height};
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }


}