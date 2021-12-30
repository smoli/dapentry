import {GrObject, ObjectType, POI, POIMap, Point2D} from "./GrObject";

export class GrLine extends GrObject {
    private _x2: number;
    private _y2: number;
    private _x1: number;
    private _y1: number;

    protected constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        super(ObjectType.Line, name, x, y);
        this._x1 = x1 - x;
        this._y1 = y1 - y;
        this._x2 = x2 - x;
        this._y2 = y2 - y;
    }

    public static create(name: string, x1: number, y1: number, x2: number, y2: number) {
        const i = GrObject.getPoolInstance(name) as GrLine;
        if (!i) {
            return GrObject.setPoolInstance(new GrLine(name, x1, y1, x2, y2)) as GrLine
        }
        i.x1 = x1;
        i.y1 = y1;
        i.x2 = x2;
        i.y2 = y2;

        return i;
    }


    protected updateCenter() {
        const x1 = this._x1 + this._x;
        const x2 = this._x2 + this._x;
        const y1 = this._y1 + this._y;
        const y2 = this._y2 + this._y;
        this._x = (x1 + x2) / 2;
        this._y = (y1 + y2) / 2;
        this._x1 = x1 - this._x;
        this._x2 = x2 - this._x;
        this._y1 = y1 - this._y;
        this._y2 = y2 - this._y;

    }

    get y2(): number {
        return this._y2;
    }

    set y2(value: number) {
        this._y2 = value - this.y;
        this.updateCenter();
    }

    get x2(): number {
        return this._x2;
    }

    set x2(value: number) {
        this._x2 = value - this.x;
        this.updateCenter();
    }

    get y1(): number {
        return this._y1;
    }

    set y1(value: number) {
        this._y1 = value - this.y;
        this.updateCenter();
    }

    get x1(): number {
        return this._x1;
    }

    set x1(value: number) {
        this._x1 = value - this.x;
        this.updateCenter();
    }

    get start(): Point2D {
        return {x: this.x1, y: this.y1}
    }

    get end(): Point2D {
        return {x: this.x2, y: this.y2}
    }

    get pointsOfInterest(): POIMap {
        return {
            [POI.start]: this.start,
            [POI.end]: this.end,
            [POI.center]: { x: 0, y: 0 }
        }
    }
}