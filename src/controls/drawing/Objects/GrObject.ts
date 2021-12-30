import {Style} from "./StyleManager";

export enum ObjectType {
    Circle,
    Rectangle,
    Ellipse,
    Square,
    Line
}


/**
 * Point of interest identifier
 */
export enum POI {
    center,
    top,
    left,
    bottom,
    right,
    start,
    end
}

export type POIMap = {[key in POI]?: Point2D };

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

    set strokeWidth(value: number) {
        this._style.strokeWidth = value;
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
    get pointsOfInterest():POIMap {
        return {
            [POI.center]: this.center,
            [POI.top]: this.top,
            [POI.bottom]: this.bottom,
            [POI.left]: this.left,
            [POI.right]: this.right
        }
    }

    /**
     * Move the POI of an object. How this behaves depends
     * on the implementation of the object type. By default
     * (this implementation) the whole object is moved by
     * moving its center.
     *
     * @param poi           The point of interest to move
     * @param vector        The vector to move the POI by
     */
    public movePOI(poi:POI, vector:Point2D):void {
        this._x += vector.x;
        this._y += vector.y;
    }
}

