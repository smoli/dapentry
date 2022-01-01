import {BoundingBox, GrObject, ObjectType} from "./GrObject";

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

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._radius * 2, h: this._radius * 2};
    }


}