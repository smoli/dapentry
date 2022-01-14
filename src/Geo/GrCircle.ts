import {BoundingBox, GrObject, ObjectType} from "./GrObject";
import {Point2D, TWO_PI} from "./GeoMath";

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

}