import {GrObject, ObjectProperty, ObjectType, POI, POIMap, POIPurpose, ScaleMode, ScaleModes} from "./GrObject";
import {deg2rad, eq, rad2deg} from "./GeoMath";
import {Point2D} from "./Point2D";
import {Line2D} from "./Line2D";


export class GrLine extends GrObject {
    private _start: Point2D;
    private _end: Point2D;

    constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        super(ObjectType.Line, name, x, y);
        this._start = new Point2D(x1, y1);
        this._end = new Point2D(x2, y2);
        this.updateCenter();

    }

    public static create(name: string, x1: number, y1: number, x2: number, y2: number) {
        return new GrLine(name, x1, y1, x2, y2);
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


    rotateByDeg(value: number, pivot: Point2D = null) {
        super.rotateByDeg(value, pivot);

        if (!pivot) {
            pivot = this.center;
        }

        this._start.rotate(deg2rad(value), pivot);
        this._end.rotate(deg2rad(value), pivot);

        this._center = this._end.copy.sub(this._start).scale(0.5).add(this._start);
    }


    get start(): Point2D {
        return this._start;
    }

    get end(): Point2D {
        return this._end;

    }

    pointsOfInterest(purpose: POIPurpose): POIMap {
        return {
            [POI.start]: this.start.copy,
            [POI.end]: this.end.copy,
            [POI.center]: this.center.copy
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


    get supportedScaleModes():ScaleModes {
        return [ScaleMode.UNIFORM];
    }


    scale(fx: number, fy: number, pivot: Point2D = null) {
        const sc = p => {
            const pl = this.mapPointToLocal(pivot);
            const cl = this.mapPointToLocal(p);
            // Compute translation for point in local coordinates
            const dxl = (pl.x - cl.x) * (1 - fx);
            const dyl = (pl.y - cl.y) * (1 - fy);

            if (!eq(dxl, 0) || !eq(dyl, 0)) {
                // Map to global coordinates
                const dg = this.mapVectorToGlobal(new Point2D(dxl, dyl));
                p.add(dg);
            }
        }

        sc(this._start);
        sc(this._end);

        this.updateCenter();
    }

    getPointAtPercentage(pct: number): Point2D {
        return this.start.copy.add(this.end.copy.sub(this.start).scale(pct));
    }

    projectPoint(point: Point2D): Point2D {
        const l = Line2D.createPP(this.start, this.end);
        const p = l.projectPoint(point);

        let n = this.getPercentageForPoint(p);
        if (n < 0) {
            return this.start;
        } else if (n > 1) {
            return this.end;
        }

        return p;
    }

    getPercentageForPoint(p: Point2D): number {
        const u = this._end.copy.sub(this._start);
        let n;
        if (u.x !== 0) {
            n = (p.x - this._start.x) / u.x;
        } else {
            n = (p.y - this._start.y) / u.y;
        }

        return n;
    }

    projectPointAsPercentage(point: Point2D): number {
        const l = Line2D.createPP(this.start, this.end);
        const p = l.projectPoint(point);

        let n = this.getPercentageForPoint(p);
        if (n < 0) {
            return 0;
        } else if (n > 1) {
            return 1;
        }

        return n;
    }

    get publishedProperties(): Array<ObjectProperty> {
        const vec = this._end.copy.sub(this._start);
        return [
            {
                name: "Length",
                id: "length",
                value: vec.length
            },
            {
                name: "Angle to X-Axis",
                id: "angle",
                value: rad2deg(vec.angleTo(new Point2D(1, 0)))
            },
            {
                name: "Angle to Y-Axis",
                id: "angley",
                value: rad2deg(vec.angleTo(new Point2D(0, 1)))
            }
        ];
    }

}
