import {BoundingBox, GrObject, ObjectType} from "./GrObject";
import {Point2D} from "./Point2D";
import {Line2D} from "./Line2D";
import {Circle2D} from "./Circle2D";
import {TWO_PI} from "./GeoMath";
import {AppConfig} from "../AppConfig";

export enum AspectRatio {
    ar1_1,
    ar3_2,
    ar4_3,
    ar16_9,
    ar16_10
}

export class GrCanvas extends GrObject {
    private _width: number;
    private _height: number;

    constructor(x1: number, y1: number, width: number, height: number) {

        const x = (width - x1) / 2 + x1;
        const y = (height - y1) / 2 + y1;

        super(ObjectType.Canvas, AppConfig.Runtime.canvasObjectName, x, y);

        this._width = width;
        this._height = height;
    }

    static create(aspectRatio: AspectRatio, width: number): GrCanvas {
        switch (aspectRatio) {
            case AspectRatio.ar1_1:
                return GrCanvas.create_1_1(width);

            case AspectRatio.ar3_2:
                return GrCanvas.create_3_2(width);

            case AspectRatio.ar4_3:
                return GrCanvas.create_4_3(width);

            case AspectRatio.ar16_9:
                return GrCanvas.create_16_9(width);

            case AspectRatio.ar16_10:
                return GrCanvas.create_16_10(width);
        }
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

    get isSelectable(): boolean {
        return false;
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
