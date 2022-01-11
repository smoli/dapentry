import {BoundingBox, GrObject, ObjectType, POI, POIMap} from "./GrObject";
import {deg2rad, Point2D} from "./GeoMath";


function computeCenterAndBB(points: Array<Point2D>) {
    let center = new Point2D(0, 0);

    let maxX = Math.max(...points.map(p => p.x));
    let minX = Math.min(...points.map(p => p.x));
    let maxY = Math.max(...points.map(p => p.y));
    let minY = Math.min(...points.map(p => p.y));

    center = new Point2D((minX + maxX) / 2, (minY + maxY) / 2);

    let width = maxX - minX;
    let height = maxY - minY;

    return {center, width, height};
}

export class GrPolygonBase extends GrObject {
    protected _points: Array<Point2D>;
    protected _closed: boolean;
    protected _width: number;
    protected _height: number;

    protected constructor(type: ObjectType, name: string, points: Array<Point2D>, closed: boolean = false) {
        let {center, width, height} = computeCenterAndBB(points);
        super(type, name, center.x, center.y);
        this._points = points;
        this._closed = closed;
        this._width = width;
        this._height = height;
    }

    protected computeCenterAndBB() {
        let {center, width, height} = computeCenterAndBB(this._points);
        this._center = center;
        this._width = width;
        this._height = height;
    }

    createProxy(): GrObject {
        return this.copy();
    }

    protected copy(): GrPolygonBase {
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

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._width, h: this._height};
    }

    public addPoint(point: Point2D) {
        this._points.push(point.copy);
        this.computeCenterAndBB();
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

    rotate(value: number) {
        super.rotate(value);
        const a = deg2rad(value);
        this._points.forEach(p => p.rotate(a, this.center));
    }

    get pointsOfInterest(): POIMap {
        const r = {};

        this._points.forEach((p, i) => {
            r[POI["P" + i]] = p.copy;
        })

        return r;
    }
}


export class GrPolygon extends GrPolygonBase {
    protected constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Polygon, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false) {
        const i = GrObject.getPoolInstance(name) as GrPolygon;
        if (!i) {
            return GrObject.setPoolInstance(new GrPolygon(name, points, closed)) as GrPolygon;
        }
        i._points = points;
        i._closed = closed;
        i.computeCenterAndBB();
        return i;
    }

    protected copy(): GrPolygonBase {
        return GrPolygon.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }
}

export class GrQuadratic extends GrPolygonBase {
    protected constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Quadratic, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false) {
        const i = GrObject.getPoolInstance(name) as GrQuadratic;
        if (!i) {
            return GrObject.setPoolInstance(new GrQuadratic(name, points, closed)) as GrQuadratic;
        }
        i._points = points;
        i._closed = closed;
        i.computeCenterAndBB();

        return i;
    }

    protected copy(): GrPolygonBase {
        return GrQuadratic.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }

}

export class GrBezier extends GrPolygonBase {
    protected constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        super(ObjectType.Bezier, name, points, closed);
    }

    public static create(name: string, points: Array<Point2D>, closed: boolean = false) {
        const i = GrObject.getPoolInstance(name) as GrBezier;
        if (!i) {
            return GrObject.setPoolInstance(new GrBezier(name, points, closed)) as GrQuadratic;
        }
        i._points = points;
        i._closed = closed;
        i.computeCenterAndBB();

        return i;
    }

    protected copy(): GrPolygonBase {
        return GrBezier.create(this._uniqueName, this._points.map(p => p.copy), this._closed);
    }

}
