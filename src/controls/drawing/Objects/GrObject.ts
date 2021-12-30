import {Style} from "./StyleManager";

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


export interface Point2D {
    x:number,
    y:number
}


/**
 * Base class for graphical objects that are displayed on the drawing.
 *
 * The instances are pooled by their name.
 */
export abstract class GrObject {

    private static _instanceCounter:number = 0;
    private static _pool: {[key:string]:GrObject} = {}

    private _name:string;
    protected _y:number;
    protected _x:number;
    private _scaleX:number = 1;
    private _scaleY:number = 1;
    private _rotation:number = 0;
    private _style:Style = null;
    private _instanceCount = GrObject._instanceCounter++;

    private readonly _type:ObjectType;

    protected constructor(type:ObjectType, name:string, x:number, y:number) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._type = type;

        if (name === null) {
            this._makeName();
        }
    }

    protected static getPoolInstance(name:string) {
        return name && GrObject._pool[name];
    }

    protected static setPoolInstance(object:GrObject):GrObject {
        GrObject._pool[object.name] = object;
        return object;
    }

    get instanceCount(): number {
        return this._instanceCount;
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

    get style(): Style {
        return this._style;
    }

    set style(value: Style) {
        this._style = value;
    }

    set fillColor(value: string) {
        this._style.fillColor = value;
    }

    set fillOpacity(value: number) {
        this._style.fillOpacity = value;
    }

    set strokeColor(value: string) {
        this._style.strokeColor = value;
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


    /**
     * Point at the center of the object relative to the
     * object's origin.
     */
    get center():Point2D  {
        return { x: 0, y: 0 };
    }

    /**
     * Point at the bottom center of the object.
     * Relative to the object's origin.
     */
    get bottom():Point2D {
        return { x: 0, y: this.boundingBox.h / 2 };
    }

    /**
     * Point at the left center of the object relative
     * to the object's origin.
     */
    get left():Point2D {
        return { x:  -this.boundingBox.w / 2, y: 0 };
    }

    /**
     * Point at the top center of the object relative to
     * the object's origin.
     */
    get top():Point2D {
        return { x: 0, y: -this.boundingBox.h / 2 };
    }

    /**
     * Point at the right center of the object relative
     * to the object's origin.
     */
    get right():Point2D {
        return { x: this.boundingBox.w / 2, y: 0 };
    }

    /**
     * Get distinctive points of the object. These can be
     * used for snapping and other things.
     */
    get pointsOfInterest():{[key: string]: Point2D } {
        return {
            center: this.center,
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right
        }
    }
}

export class GrCircle extends GrObject {

    private _r:number

    protected constructor(name:string, x:number, y:number, r:number) {
        super(ObjectType.Circle, name, x, y);
        this._r = r;
    }

    public static create(name:string, x:number, y:number, r:number):GrCircle {
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
        return { ...super.boundingBox, w: this._r * 2, h: this._r * 2 };
    }


}

export class GrRectangle extends GrObject {

    private _w:number;
    private _h:number;

    protected constructor(name: string, x:number, y:number, w:number, h:number) {
        super(ObjectType.Rectangle, name, x, y);
        this._w = w;
        this._h = h;
    }

    public static create(name: string, x:number, y:number, w:number, h:number) {
        const i = GrObject.getPoolInstance(name) as GrRectangle;
        if (!i) {
            return GrObject.setPoolInstance(new GrRectangle(name, x, y, w, h)) as GrRectangle;
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
        return { ...super.boundingBox, w: this._w, h: this._h };
    }
}

export class GrLine extends GrObject {
    private _x2:number;
    private _y2:number;
    private _x1: number;
    private _y1: number;

    protected constructor(name: string, x1:number, y1:number, x2:number, y2:number) {
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        super(ObjectType.Line, name, x, y);
        this._x1 = x1 - x;
        this._y1 = y1 - y;
        this._x2 = x2 - x;
        this._y2 = y2 - y;
    }

    public static create(name: string, x1:number, y1:number, x2:number, y2:number) {
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

    get pointsOfInterest(): { [p: string]: Point2D } {
        return {
            "start": { x: this.x1, y: this.y1 },
            "end": { x: this.x2, y: this.y2 },
            "center": { x: this.x, y: this.y }
        }
    }

}

export class GrEllipse extends GrObject {

    private _w:number;
    private _h:number;

    protected constructor(name: string, x:number, y:number, w:number, h:number) {
        super(ObjectType.Ellipse, name, x, y);
        this._w = w;
        this._h = h;
    }

    public static create(name: string, x:number, y:number, w:number, h:number) {
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
        return { ...super.boundingBox, w: this._w, h: this._h };
    }

}