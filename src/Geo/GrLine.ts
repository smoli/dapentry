import {GrObject, ObjectType, POI, POIMap} from "./GrObject";
import {deg2rad} from "./GeoMath";
import {Point2D} from "./Point2D";
import {Line2D} from "./Line2D";


export class GrLine extends GrObject {
    private _start: Point2D;
    private _end: Point2D;

    protected constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        super(ObjectType.Line, name, x, y);
        this._start = new Point2D(x1, y1);
        this._end = new Point2D(x2, y2);
        this.updateCenter();

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


    createProxy(): GrObject {
        return this.copy();
    }

    protected copy(): GrObject {
        return GrLine.create(this._uniqueName, this.x1, this.y1, this.x2, this.y2);
    }


    protected updateCenter() {
        this._center = new Point2D(this._end.x - this._start.x, this._end.y - this._start.y).scale(0.5);
        this._center.add(this._start);
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

    rotate(value: number) {
        super.rotate(value);

        const p1 = this._start.copy.sub(this._center);
        const p2 = this._end.copy.sub(this._center);

        p1.rotate(deg2rad(value));
        p2.rotate(deg2rad(value));

        this._start = this._center.copy.add(p1);
        this._end = this._center.copy.add(p2);

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

    getOppositePoi(poi: POI): POI {
        switch (poi) {
            case POI.start:
                return POI.end;
            case POI.end:
                return POI.start

            default:
                return super.getOppositePoi(poi);
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

    projectPoint(point: Point2D): Point2D {
        const l = Line2D.createPP(this.start, this.end);
        const p = l.projectPoint(point);

        const u = this._end.copy.sub(this._start);
        const n = (p.x - this._start.x) / u.x;

        if (n < 0) {
            return this.start;
        } else if (n > 1) {
            return this.end;
        }

        return p;
    }

    projectPointAsPercentage(point: Point2D): number {
        const l = Line2D.createPP(this.start, this.end);
        const p = l.projectPoint(point);

        const u = this._end.copy.sub(this._start);
        const n = (p.x - this._start.x) / u.x;

        if (n < 0) {
            return 0;
        } else if (n > 1) {
            return 1;
        }

        return n;
    }

}