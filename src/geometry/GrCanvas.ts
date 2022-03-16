import {BoundingBox, GrObject, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {Point2D} from "./Point2D";
import {AppConfig} from "../core/AppConfig";
import {AspectRatio} from "./AspectRatio";


export function getWidthForHeight(height: number, ar: AspectRatio) {
    switch (ar) {
        case AspectRatio.ar1_1:
            return height;

        case AspectRatio.ar3_2:
            return 3 * height / 2;

        case AspectRatio.ar4_3:
            return 4 * height / 3;

        case AspectRatio.ar16_10:
            return 16 * height / 10;

        case AspectRatio.ar16_9:
            return 16 * height / 9;
    }
}

export function getHeightForWidth(width: number, ar: AspectRatio) {
    switch (ar) {
        case AspectRatio.ar1_1:
            return width;

        case AspectRatio.ar3_2:
            return 2 * width / 3;

        case AspectRatio.ar4_3:
            return 3 * width / 4;

        case AspectRatio.ar16_10:
            return 10 * width / 16;

        case AspectRatio.ar16_9:
            return 9 * width / 16;
    }
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

    static create(aspectRatio: AspectRatio, height: number): GrCanvas {
        switch (aspectRatio) {
            case AspectRatio.ar1_1:
                return GrCanvas.create_1_1(height);

            case AspectRatio.ar3_2:
                return GrCanvas.create_3_2(height);

            case AspectRatio.ar4_3:
                return GrCanvas.create_4_3(height);

            case AspectRatio.ar16_9:
                return GrCanvas.create_16_9(height);

            case AspectRatio.ar16_10:
                return GrCanvas.create_16_10(height);
        }
    }

    static create_1_1(height: number): GrCanvas {
        return new GrCanvas(0, 0, height, height);
    }

    static create_3_2(height:number): GrCanvas {
        return new GrCanvas(0, 0, 3 * height / 2, height);
    }

    static create_4_3(height:number): GrCanvas {
        return new GrCanvas(0, 0, 4 * height / 3, height);
    }

    static create_16_10(height:number): GrCanvas {
        return new GrCanvas(0, 0, 16 * height / 10, height);
    }

    static create_16_9(height:number): GrCanvas {
        return new GrCanvas(0, 0, 16 * height / 9, height);
    }

    get isSelectable(): boolean {
        return true;
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

    get topLeft(): Point2D {
        return this.makePoint(-this.width / 2, -this.height / 2);
    }

    get topRight(): Point2D {
        return this.makePoint(this.width / 2, -this.height / 2);
    }

    get bottomRight(): Point2D {
        return this.makePoint(this.width / 2, this.height / 2);
    }

    get bottomLeft(): Point2D {
        return this.makePoint(-this.width / 2, this.height / 2);
    }

    pointsOfInterest(purpose: POIPurpose): POIMap {
        return {
            ...super.pointsOfInterest(purpose),
            [POI.topLeft]: this.topLeft.copy,
            [POI.topRight]: this.topRight.copy,
            [POI.bottomLeft]: this.bottomLeft.copy,
            [POI.bottomRight]: this.bottomRight.copy
        };
    }

}
