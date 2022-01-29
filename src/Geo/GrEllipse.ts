import {BoundingBox, GrObject, ObjectType} from "./GrObject";

export class GrEllipse extends GrObject {

    private _width: number;
    private _height: number;

    constructor(name: string, x: number, y: number, w: number, h: number) {
        super(ObjectType.Ellipse, name, x, y);
        this._width = w;
        this._height = h;
    }

    public static create(name: string, x: number, y: number, w: number, h: number) {
        return new GrEllipse(name, x, y, w, h);
    }

    protected copy(): GrObject {
        return GrEllipse.create(this._uniqueName, this.center.x, this.center.y, this.width, this.height);
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