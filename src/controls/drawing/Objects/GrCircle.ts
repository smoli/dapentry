import {BoundingBox, GrObject, ObjectType} from "./GrObject";

export class GrCircle extends GrObject {

    private _r: number

    protected constructor(name: string, x: number, y: number, r: number) {
        super(ObjectType.Circle, name, x, y);
        this._r = r;
    }

    public static create(name: string, x: number, y: number, r: number): GrCircle {
        const i = GrObject.getPoolInstance(name) as GrCircle;
        if (!i) {
            return GrObject.setPoolInstance(new GrCircle(name, x, y, r)) as GrCircle;
        }
        i.x = x;
        i.y = y;
        i.r = r;
        return i;
    }

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._r * 2, h: this._r * 2};
    }


}