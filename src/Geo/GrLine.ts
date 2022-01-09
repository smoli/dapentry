import {GrObject, ObjectType, POI, POIMap} from "./GrObject";
import {Point2D} from "./GeoMath";

export class GrLine extends GrObject {
    private _start: Point2D;
    private _end: Point2D;

    protected constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        super(ObjectType.Line, name, x, y);
        this._start = new Point2D(x1, y1);
        this._end = new Point2D(x2, y2);

    }

    public static create(name: string, x1: number, y1: number, x2: number, y2: number) {
        const i = GrObject.getPoolInstance(name) as GrLine;
        if (!i) {
            return GrObject.setPoolInstance(new GrLine(name, x1, y1, x2, y2)) as GrLine
        } else {
            i._start = new Point2D(x1, y1);
            i._end = new Point2D(x2, y2);
            i.updateCenter();
        }

        return i;
    }


    protected updateCenter() {
        const x1 = this._start.x + this.x;
        const y1 = this._start.y + this.y;
        const x2 = this._end.x + this.x;
        const y2 = this._end.y + this.y;

        this._center = new Point2D((x1 + x2) / 2, this.y = (y1 + y2) / 2);
    }

    get y2(): number {
        return this._end.y;
    }

    set y2(value: number) {
        this._end.y = value;
        this.updateCenter();
    }

    get x2(): number {
        return this._end.x;
    }

    set x2(value: number) {
        this._end.x = value;
        this.updateCenter();
    }

    get y1(): number {
        return this._start.y;
    }

    set y1(value: number) {
        this._start.y = value;
        this.updateCenter();
    }

    get x1(): number {
        return this._start.x;
    }

    set x1(value: number) {
        this._start.x = value;
        this.updateCenter();
    }

    get start(): Point2D {
        return this._start;
    }

    get end(): Point2D {
        return this._end;

    }

    get pointsOfInterest(): POIMap {
        return {
            [POI.start]: this.start,
            [POI.end]: this.end,
            [POI.center]: this.center
        }
    }

    public movePOI(poi: POI, vector: Point2D): void {
        if (poi === POI.center) {
            super.movePOI(poi, vector);
        }

        if (poi === POI.start) {
            this._start.x += vector.x;
            this._start.y += vector.y;
            this.updateCenter();
        } else if (poi === POI.end) {
            this._end.x += vector.x;
            this._end.y += vector.y;
            this.updateCenter();
        }
    }

    getPointAtPercentage(pct: number): Point2D {
        return this.start.copy.add(this.end.copy.sub(this.start).scale(pct));
    }

}