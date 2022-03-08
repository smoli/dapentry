import {BoundingBox, GrObject, ObjectProperty, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {Point2D} from "./Point2D";
import {eqp} from "./GeoMath";
import {publicDecrypt} from "crypto";

export class GrRectangle extends GrObject {

    private _width: number;
    private _height: number;

    constructor(name: string, x: number, y: number, w: number, h: number) {
        super(ObjectType.Rectangle, name, x, y);
        this._width = w;
        this._height = h;
    }

    public static create(name: string, x: number, y: number, w: number, h: number) {
        return new GrRectangle(name, x, y, w, h);
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

    /**
     *
     * @param fx        Has to be interpreted in local coordinate system
     * @param fy        Has to be interpreted in local coordinate system
     * @param pivot
     */
    scale(fx: number, fy: number, pivot: Point2D = null) {

        if (eqp(pivot, this._center)) {
            this._width *= Math.abs(fx);
            this._height *= Math.abs(fy);
            return;
        }

        const pl = this.mapPointToLocal(pivot);
        const cl = this.mapPointToLocal(this._center);

        // Compute translation for center in local coordinates
        const dxl = (pl.x - cl.x) * (1 - fx);
        const dyl = (pl.y - cl.y) * (1 - fy);

        // Map to global coordinates
        const dg = this.mapVectorToGlobal(new Point2D(dxl, dyl));

        this._center.add(dg);
        this._width *= Math.abs(fx);
        this._height *= Math.abs(fy);
    }

    getScaleResetInfo(): any {
        return {
            width: this._width,
            height: this._height,
            center: this.center.copy
        }
    }

    resetScaling(info: { width: number, height: number, center: Point2D }) {
        this._width = info.width;
        this._height = info.height;
        this._center = info.center.copy;
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

    get publishedProperties(): Array<ObjectProperty> {
        return [
            {
                name: "Width",
                id: "width",
                value: this._width
            },
            {
                name: "Height",
                id: "height",
                value: this._height
            },
            {
                name: "Area",
                id: "area",
                value: this._width * this._height
            },
            {
                name: "Circumference",
                id: "circumference",
                value: 2 * (this._width + this._height)
            },
            ...super.publishedProperties
        ]
    }
}
