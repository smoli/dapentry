import {BoundingBox, GrObject, ObjectType} from "./GrObject";

export class GrRectangle extends GrObject {

    private _width: number;
    private _height: number;

    protected constructor(name: string, x: number, y: number, w: number, h: number) {
        super(ObjectType.Rectangle, name, x, y);
        this._width = w;
        this._height = h;
    }

    public static create(name: string, x: number, y: number, w: number, h: number) {
        const i = GrObject.getPoolInstance(name) as GrRectangle;
        if (!i) {
            return GrObject.setPoolInstance(new GrRectangle(name, x, y, w, h)) as GrRectangle;
        }
        i.x = x;
        i.y = y;
        i.width = w;
        i.height = h;
        return i;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get boundingBox(): BoundingBox {
        return {...super.boundingBox, w: this._width, h: this._height};
    }
}