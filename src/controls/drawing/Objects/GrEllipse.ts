import {BoundingBox, GrObject, ObjectType} from "./GrObject";

export class GrEllipse extends GrObject {

    private _w: number;
    private _h: number;

    protected constructor(name: string, x: number, y: number, w: number, h: number) {
        super(ObjectType.Ellipse, name, x, y);
        this._w = w;
        this._h = h;
    }

    public static create(name: string, x: number, y: number, w: number, h: number) {
        const i = GrObject.getPoolInstance(name) as GrEllipse;
        if (!i) {
            return GrObject.setPoolInstance(new GrEllipse(name, x, y, w, h)) as GrEllipse
        }
        i.x = x;
        i.y = y;
        i.w = w;
        i.h = h;

        return i;
    }

    get h(): number {
        return this._h;
    }

    set h(value: number) {
        this._h = value;
    }

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = value;
    }

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._w, h: this._h};
    }

}