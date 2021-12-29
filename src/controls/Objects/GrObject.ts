export enum ObjectType {
    Circle,
    Rectangle,
    Ellipse,
    Square,
    Line
}

let objCounter = 1;
function getObjectName(prefix:string):string {
    return prefix + objCounter++;
}

/**
 * Bounding box of an object
 */
export interface BoundingBox {
    /**
     * Center x
     */
    x: number,

    /**
     * Center y
     */
    y: number,

    /**
     * Width
     */
    w: number,

    /**
     * Height
     */
    h: number
}

export abstract class GrObject {

    private _name:string;
    private _x:number;
    private _y:number;
    private _scaleX:number = 1;
    private _scaleY:number = 1;
    private _rotation:number = 0;

    private readonly _type:ObjectType;

    protected constructor(type:ObjectType, x:number, y:number) {
        this._x = x;
        this._y = y;
        this._type = type;

        this._makeName()
    }

    get type(): ObjectType {
        return this._type;
    }

    protected _makeName() {
        this._name = getObjectName(ObjectType[this._type]);
    }

    get id(): string {
        return this._name;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get rotation(): number {
        return this._rotation;
    }

    set rotation(value: number) {
        this._rotation = value;
    }
    get scaleY(): number {
        return this._scaleY;
    }

    set scaleY(value: number) {
        this._scaleY = value;
    }
    get scaleX(): number {
        return this._scaleX;
    }

    set scaleX(value: number) {
        this._scaleX = value;
    }

    /**
     * Return the bounding box of the object.
     * This is unrotated and unscaled.
     *
     * @return Bounding box
     */
    get boundingBox():BoundingBox {
        return { x: this._x, y: this._y, w: 0, h: 0 };
    }
}

export class GRCircle extends GrObject {

    private _r:number

    constructor(x:number, y:number, r:number) {
        super(ObjectType.Circle, x, y);
        this._r = r;
    }

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }

    get boundingBox(): BoundingBox {
        return { ...super.boundingBox, w: this._r * 2, h: this._r * 2 };
    }
}

export class GRRectangle extends GrObject {

    private _w:number;
    private _h:number;

    constructor(x:number, y:number, w:number, h:number) {
        super(ObjectType.Rectangle, x, y);
        this._w = w;
        this._h = h;
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
        return { ...super.boundingBox, w: this._w, h: this._h };
    }
}

export class GREllipse extends GrObject {

    private _w:number;
    private _h:number;

    constructor(x:number, y:number, w:number, h:number) {
        super(ObjectType.Ellipse, x, y);
        this._w = w;
        this._h = h;
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
        return { ...super.boundingBox, w: this._w, h: this._h };
    }

}