import {BoundingBox, GrObject, ObjectProperty, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {deg2rad} from "./GeoMath";
import {Point2D} from "./Point2D";
import {NOT_IMPLEMENTED} from "../core/Assertions";


export class GrPolygonBase extends GrObject {
    protected _points: Array<Point2D>;
    protected _closed: boolean;
    protected _width: number;
    protected _height: number;

    protected constructor(type: ObjectType, name: string, points: Array<Point2D>, closed: boolean = false) {
        super(type, name, 0, 0);
        if (points) {
            this._points = points.map(p => p.copy);
        } else {
            this._points = [];
        }
        this.computeCenterAndBB();
        this._closed = closed;
    }

    protected computeCenterAndBB() {
        if (this._points.length === 0) {
            this._width = this._height = 0;
            this._center = new Point2D(0, 0);
            return;
        }

        const xs = [];
        const ys = [];
        for (const p of this._points) {
            xs.push(this._xAxis.x * (p.x - this._center.x) + this._xAxis.y * (p.y - this._center.y));
            ys.push(this._yAxis.x * (p.x - this._center.x) + this._yAxis.y * (p.y - this._center.y));
        }

        let lMinX = Math.min.apply(null, xs);
        let lMaxX = Math.max.apply(null, xs);
        let lMinY = Math.min.apply(null, ys);
        let lMaxY = Math.max.apply(null, ys);

        const cl = new Point2D((lMinX + lMaxX) / 2 - xs[0], (lMinY + lMaxY) / 2 - ys[0])
        const d = this.mapVectorToGlobal(cl);
        this._center = this._points[0].copy;
        this._center.x += d.x;
        this._center.y += d.y;

        this._width = lMaxX - lMinX;
        this._height = lMaxY - lMinY;
    }

    createProxy(): GrObject {
        const copy = this.copy();
        copy._xAxis = this._xAxis.copy;
        copy._yAxis = this._yAxis.copy;
        copy.computeCenterAndBB();
        return copy;
    }

    protected copy(): GrPolygonBase {
        NOT_IMPLEMENTED();
        return null;
    }

    get closed() {
        return this._closed;
    }

    get points(): Array<Point2D> {
        return this._points;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
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


    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._width, h: this._height};
    }

    public addPoint(point: Point2D) {
        this._points.push(point.copy);

        // TODO: Possible performance optimisation. Needs a test to see if this is correct
        const bb = this.boundingBox;
        if (
                point.x < (bb.x - bb.w / 2)
            ||  point.x > (bb.x + bb.w / 2)
            ||  point.y < (bb.y - bb.h / 2)
            ||  point.y > (bb.y + bb.h / 2)
        )  {
            this.computeCenterAndBB();
        }

    }

    public removeLastPoint() {
        this._points.pop();
        this.computeCenterAndBB();
    }

    public setPoint(index: number, point: Point2D) {
        this._points[index] = point;
        this.computeCenterAndBB();
    }

    movePOI(poi: POI, byVector: Point2D) {
        this._points.forEach(p => p.add(byVector));
        this.computeCenterAndBB();
    }

    rotateByDeg(value: number) {
        super.rotateByDeg(value);
        const a = deg2rad(value);
        this._points.forEach(p => p.rotate(a, this.center));
    }

    pointsOfInterest(purpose:POIPurpose): POIMap {

        if (purpose === POIPurpose.SCALING) {
            return {
                ...super.pointsOfInterest(purpose),
                [POI.topLeft]: this.topLeft.copy,
                [POI.topRight]: this.topRight.copy,
                [POI.bottomLeft]: this.bottomLeft.copy,
                [POI.bottomRight]: this.bottomRight.copy
            };
        }

        const r = {
            [POI.center]: this.center.copy
        };

        this._points.forEach((p, i) => {
            r[POI["P" + i]] = p.copy;
        })

        return r;
    }

    getPivotFor(poi: POI): POI {
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
                return super.getPivotFor(poi);
        }
    }

    scale(fx: number, fy: number, pivot: Point2D = null) {
        const pl = this.mapPointToLocal(pivot);

        for (const p of this._points) {
            const cl = this.mapPointToLocal(p);
            // Compute translation for point in local coordinates
            const dxl = (pl.x - cl.x) * (1 - fx);
            const dyl = (pl.y - cl.y) * (1 - fy);

            // Map to global coordinates
            const dg = this.mapVectorToGlobal(new Point2D(dxl, dyl));

            p.add(dg);
        }

        this.computeCenterAndBB();
    }

    getScaleResetInfo(): any {
        return {
            center: this._center.copy,
            points: this._points.map(p => p.copy)
        }
    }

    resetScaling(info: { center: Point2D, points: Array<Point2D> }) {
        this._center = info.center;
        this._points = info.points.map(p => p.copy);
    }
}


export class GrPolygon extends GrPolygonBase {
    constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Polygon, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false) {
        return new GrPolygon(name, points, closed);
    }

    protected copy(): GrPolygonBase {
        return GrPolygon.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }

    get publishedProperties(): Array<ObjectProperty> {

        let length = 0;

        if (this._points.length > 1) {
            let lp = this._points[0];
            for (let i = 1; i < this._points.length; i++) {
                length += this._points[i].copy.sub(lp).length
                lp = this._points[i];
            }

            if (this._closed) {
                length += this._points[0].copy.sub(lp).length
            }
        }

        return [
            {
                name: "Circumference",
                id: "circumference",
                value: length
            },
            ...super.publishedProperties
        ]

    }
}

export class GrQuadratic extends GrPolygonBase {
    protected constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Quadratic, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false): GrQuadratic {
        return new GrQuadratic(name, points, closed);

    }

    protected copy(): GrPolygonBase {
        return GrQuadratic.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }

}

export class GrBezier extends GrPolygonBase {
    constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Bezier, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false): GrBezier {
        return new GrBezier(name, points, closed);
    }

    protected copy(): GrPolygonBase {
        return GrBezier.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }

}
