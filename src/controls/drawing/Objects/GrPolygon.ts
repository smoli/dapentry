import {BoundingBox, GrObject, ObjectType, POI} from "./GrObject";
import {Point2D} from "./GeoMath";


function computeCenterAndBB(points: Array<Point2D>) {
    let center = new Point2D(0, 0);

    let maxX = Math.max(...points.map(p => p.x));
    let minX = Math.min(...points.map(p => p.x));
    let maxY = Math.max(...points.map(p => p.y));
    let minY = Math.min(...points.map(p => p.y));

    for (const p of points) {
        center.add(p);
    }
    center.scale(1 / points.length);

    let width = maxX - minX;
    let height = maxY - minY;

    return {center, width, height};
}

export class GrPolygon extends GrObject {

    private _points: Array<Point2D>;
    private _closed: boolean;
    private _width: number;
    private _height: number;

    protected constructor(name: string, points: Array<Point2D>, closed: boolean = false) {
        let {center, width, height} = computeCenterAndBB(points);
        super(ObjectType.Polygon, name, center.x, center.y);
        this._points = points;
        this._closed = closed;
        this._width = width;
        this._height = height;
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

    protected computeCenterAndBB() {
        let {center, width, height} = computeCenterAndBB(this._points);
        this._center = center;
        this._width = width;
        this._height = height;
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
        this._points.push(point.copy());
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

}