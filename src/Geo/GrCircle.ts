import {BoundingBox, GrObject, ObjectType} from "./GrObject";
import {TWO_PI} from "./GeoMath";
import {Point2D} from "./Point2D";
import {Line2D} from "./Line2D";
import {Circle2D} from "./Circle2D";

export class GrCircle extends GrObject {

    private _radius: number

    protected constructor(name: string, x: number, y: number, r: number) {
        super(ObjectType.Circle, name, x, y);
        this._radius = r;
    }

    public static create(name: string, x: number, y: number, r: number): GrCircle {
        const i = GrObject.getPoolInstance(name) as GrCircle;
        if (!i) {
            return GrObject.setPoolInstance(new GrCircle(name, x, y, r)) as GrCircle;
        }
        i.x = x;
        i.y = y;
        i.radius = r;
        return i;
    }

    protected copy(): GrObject {
        return GrCircle.create(this._uniqueName, this.center.x, this.center.y, this.radius);
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._radius * 2, h: this._radius * 2};
    }


    /**
     * Interpolation is clockwise and starts at the top.
     * pct 0 is top
     * pct 1 is top again
     * pct 0.25 right
     * pct 0.5 bottom
     * pct 0.75 left
     *
     * @param pct
     */
    getPointAtPercentage(pct: number): Point2D {

        const t = TWO_PI * (pct);

        return this.top.copy.sub(this.center).rotate(t).add(this.center)

    }

    scale(fx: number, fy: number) {
        if (fx === 1)
            this._radius *= fy;
        else
            this._radius *= fx;
    }


    projectPoint(point: Point2D): Point2D {
        const l = Line2D.createPP(point, this.center);
        const c = new Circle2D(this.center, this.radius);
        const p = l.intersectCircle(c);

        const d0 = point.copy.sub(p[0]).length;
        const d1 = point.copy.sub(p[1]).length;

        if (d0 < d1) {
            return p[0];
        } else {
            return p[1];
        }
    }

    projectPointAsPercentage(point: Point2D): number {
        const p = this.projectPoint(point);
        const axis = new Point2D(0, -1);
        const a = axis.angleTo(p.sub(this.center));

        if (a < 0) {
            return -a / TWO_PI
        } else {
            return 1 - a / TWO_PI;
        }
    }

}