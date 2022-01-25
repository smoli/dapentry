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

    static create_1_1(width: number): GrCanvas {
        return new GrCanvas(0, 0, width, width);
    }

    static create_3_2(width:number): GrCanvas {
        return new GrCanvas(0, 0, width, 2 * width / 3);
    }

    static create_4_3(width:number): GrCanvas {
        return new GrCanvas(0, 0, width, 3 * width / 4);
    }

    static create_16_10(width:number): GrCanvas {
        return new GrCanvas(0, 0, width, 10 * width / 16);
    }

    static create_16_9(width:number): GrCanvas {
        return new GrCanvas(0, 0, width, 9 * width / 16);
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