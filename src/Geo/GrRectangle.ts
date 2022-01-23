import {BoundingBox, GrObject, ObjectType, POI, POIMap} from "./GrObject";
import {Point2D} from "./Point2D";

export class GrRectangle extends GrObject {

    private _width: number;
    private _height: number;

    protected constructor(name: string, x: number, y: number, w: number, h: number) {
        super(ObjectType.Rectangle, name, x, y);
        this._width = w;
        this._height = h;
    }

    public static create(name: string, x: number, y: number, w: number, h: number) {
        const i = GrObject.getPoolInstance(name) as GrRectangle;
        if (!i) {
            return GrObject.setPoolInstance(new GrRectangle(name, x, y, w, h)) as GrRectangle;
        }
        i.x = x;
        i.y = y;
        i.width = w;
        i.height = h;
        return i;
    }

    protected copy(): GrObject {
        return GrRectangle.create(this._uniqueName, this.center.x, this.center.y, this.width, this.height);
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

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._width, h: this._height};
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

    scale(fx: number, fy: number, pivot: Point2D = null) {
        this._width *= fx;
        this._height *= fy;


    }

    get pointsOfInterest(): POIMap {
        return {
            ...super.pointsOfInterest,
            [POI.topLeft]: this.topLeft,
            [POI.topRight]: this.topRight,
            [POI.bottomLeft]: this.bottomLeft,
            [POI.bottomRight]: this.bottomRight
        };
    }

    getOppositePoi(poi: POI): POI {
        switch (poi) {
            case POI.topLeft:
                return POI.bottomRight;

            case POI.topRight:
                return POI.bottomLeft;

            case POI.bottomLeft:
                return POI.topRight;

            case POI.bottomRight:
                return POI.topLeft;

            default:
                return super.getOppositePoi(poi);
        }
    }
}