import {Style} from "../controls/drawing/Objects/StyleManager";
import {deg2rad, eq} from "./GeoMath";
import {Point2D} from "./Point2D";
import {WHERE_VALUE} from "../runtime/interpreter/types/AtParameter";
import {GrCompositeObject} from "./GrCompositeObject";
import {AppConfig} from "../AppConfig";
import {Line2D} from "./Line2D";

export enum ObjectType {
    Canvas,
    Circle,
    Rectangle,
    Ellipse,
    Square,
    Line,
    Polygon,
    Quadratic,
    Bezier,
    List,
    Composite
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
    end,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    P1, P2, P3, P4, P5, P6, P7, P8, P9, P10,
    P11, P12, P13, P14, P15, P16, P17, P18, P19, P20,
    P21, P22, P23, P24, P25, P26, P27, P28, P29, P30,
    P31, P32, P33, P34, P35, P36, P37, P38, P39, P40,
    P41, P42, P43, P44, P45, P46, P47, P48, P49, P50,
    P51, P52, P53, P54, P55, P56, P57, P58, P59, P60
}

export enum POIPurpose {
    MANIPULATION,
    SCALING,
    SNAPPING
}

export type POIMap = { [key in POI]?: Point2D };

let objCounter = 1;


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


/**
 * Base class for graphical objects that are displayed on the drawing.
 *
 * The instances are pooled by their name.
 */
export abstract class GrObject {
    private static _instanceCounter: number = 0;
    private static _pool: { [key: string]: GrObject } = {}
    private static _objectNames: string[] = [AppConfig.Runtime.canvasObjectName];

    protected _uniqueName: string;
    protected _parent: GrObject = null;

    protected _center: Point2D;
    protected _xAxis: Point2D = new Point2D(1, 0);
    protected _yAxis: Point2D = new Point2D(0, 1);
    protected _style: Style = null;
    protected _instanceCount = GrObject._instanceCounter++;

    private readonly _type: ObjectType;


    protected static nameExists(name): boolean {
        return GrObject._objectNames.indexOf(name) !== -1;
    }

    protected static removeName(name) {
        const i = GrObject._objectNames.indexOf(name);
        if (i !== -1) {
            GrObject._objectNames.splice(i, 1);
        }
    }

    protected static addName(name) {
        GrObject._objectNames.push(name);
    }

    protected static makeNewObjectName(prefix: string): string {
        let counter = 1;

        while (GrObject.nameExists(prefix + counter)) counter++;

        return prefix + counter;
    }


    public static getNewObjectName(prefix: string): string {
        const name = GrObject.makeNewObjectName(prefix);
        GrObject.addName(name);

        return name;
    }

    protected constructor(type: ObjectType, name: string, x: number, y: number) {
        this._uniqueName = name;
        this._center = new Point2D(x, y);
        this._type = type;

        if (name === null) {
            this._makeName();
        } else {
            GrObject.addName(this._uniqueName)
        }

    }

    /**
     * This creates a copy of the object with the same unique name.
     * It therefore will be rendered instead of the original if it is
     * put into the render pipeline after the original object.
     *
     * Use the e.g. to represent the potential update of the object
     * during manipulation.
     */
    public createProxy(): GrObject {
        const copy = this.copy();
        copy._style = {...this._style};
        copy._xAxis = this._xAxis.copy;
        copy._yAxis = this._yAxis.copy;
        return copy;
    }

    /**
     * Make a new object of the same type with the same name.
     * @protected
     */
    protected abstract copy(): GrObject;

    get selectable():boolean {
        return true;
    }


    public setParent(value: GrObject) {
        this._parent = value;
    }

    public get parent(): GrObject {
        return this._parent;
    }

    get instanceCount(): number {
        return this._instanceCount;
    }

    get type(): ObjectType {
        return this._type;
    }

    protected _makeName() {
        this._uniqueName = GrObject.getNewObjectName(ObjectType[this._type]);
    }

    get id(): string {
        return this._uniqueName;
    }


    set uniqueName(value: string) {
        GrObject.removeName(this._uniqueName);
        this._uniqueName = value;
        if (!GrObject.nameExists(value)) {
            GrObject.addName(value);
        }
    }

    get uniqueName(): string {
        return this._uniqueName;
    }

    get name(): string {
        if (this._parent) {
            return this._parent.uniqueName;
        }

        return this._uniqueName;
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
        return this._center.y;
    }

    set y(value: number) {
        this._center.y = value;
    }

    get x(): number {
        return this._center.x;
    }

    set x(value: number) {
        this._center.x = value;
    }

    get yAxis(): Point2D {
        return this._yAxis;
    }

    get xAxis(): Point2D {
        return this._xAxis;
    }

    public rotateByDeg(value: number, pivot: Point2D = null) {
        this._xAxis.rotate(deg2rad(value));
        this._yAxis.rotate(deg2rad(value));
    }


    /**
     * Rotate the object. The poi determines the
     * pivot point. I.e. object implementation might
     * decide to rotate around bottom, when poi is top.
     *
     * poi is basically the point a user would grab in
     * order to rotate the object.
     *
     * By default this will rotate around the center. Specific
     * object implementations may decide otherwise.
     *
     * @param poi
     * @param value
     */
    public rotatePOI(poi: POI, value: number) {
        this.rotateByDeg(value, this.pointsOfInterest(POIPurpose.MANIPULATION)[this.getOppositePoi(poi)]);
    }

    public scale(fx: number, fy: number, pivot: Point2D = null) {
    }


    /**
     * Return the bounding box of the object.
     * This is not rotated and not scaled.
     *
     * @return Bounding box
     */
    get boundingBox(): BoundingBox {
        return {x: this.x, y: this.y, w: 0, h: 0};
    }


    /**
     * Point at the center of the object relative to the
     * object's origin.
     */
    get center(): Point2D {
        return this._center;
    }

    /**
     * Point at the bottom center of the object.
     * Relative to the object's origin.
     */
    get bottom(): Point2D {
        return this._yAxis.copy.scale(this.boundingBox.h / 2).add(this._center);
    }

    /**
     * Point at the left center of the object relative
     * to the object's origin.
     */
    get left(): Point2D {
        return this._xAxis.copy.scale(-this.boundingBox.w / 2).add(this._center);
    }

    /**
     * Point at the top center of the object relative to
     * the object's origin.
     */
    get top(): Point2D {
        return this._yAxis.copy.scale(-this.boundingBox.h / 2).add(this._center);

    }

    /**
     * Point at the right center of the object relative
     * to the object's origin.
     */
    get right(): Point2D {
        return this._xAxis.copy.scale(this.boundingBox.w / 2).add(this._center);
    }

    /**
     * Get "points of interest" for the object. These can be
     * used for snapping and other things.
     */
    pointsOfInterest(purpose: POIPurpose): POIMap {
        return {
            [POI.center]: this.center.copy,
            [POI.top]: this.top.copy,
            [POI.bottom]: this.bottom.copy,
            [POI.left]: this.left.copy,
            [POI.right]: this.right.copy
        }
    }

    getOppositePoi(poi: POI): POI {
        switch (poi) {
            case POI.center:
                return null;
            case POI.top:
                return POI.bottom;

            case POI.left:
                return POI.right;

            case POI.bottom:
                return POI.top;

            case POI.right:
                return POI.left;

            default:
                return null;

        }
    }

    /**
     * Move the POI of an object. How this behaves depends
     * on the implementation of the object type. By default,
     * (this implementation) the whole object is moved by
     * moving its center.
     *
     * @param poi           The point of interest to move
     * @param byVector        The vector to move the POI by
     */
    public movePOI(poi: POI, byVector: Point2D): void {
        console.log("Moving", this.uniqueName);
        this._center.add(byVector);
    }


    /**
     * Returns a point on the outline of the object. Where the point lies
     * is defined by a percentage (value 0.0 - 1.0).
     *
     *  A percentage of 0 means "the start of the objects outline"
     *  A percentage of 1 means "the end of the objects outline"
     *  0 < percentage < 1 means a "point somewhere between the start and the end"
     *
     *  How the interpolation works and what the start and the end means is object specific.
     *
     * @param pct               Value between 0 and 1
     */
    public getPointAtPercentage(pct: number): Point2D {
        return this.center;
    }

    protected makePoint(x, y): Point2D {
        return new Point2D(
            this._center.x + this._xAxis.x * x + this._yAxis.x * y,
            this._center.y + this._xAxis.y * x + this._yAxis.y * y
        )
    }

    public projectPointAsPercentage(point: Point2D): number {
        return 0;
    }

    public projectPoint(point: Point2D): Point2D {
        return null;
    }

    public at(where: WHERE_VALUE): Point2D {
        if (typeof where === "number") {
            return this.getPointAtPercentage(where);
        } else if (typeof where === "string") {
            return this.pointsOfInterest(POIPurpose.MANIPULATION)[POI[where]];
        } else {
            throw new Error(`Unknown location ${where} on ${ObjectType[this.type]}`);
        }
    }

    mapLocalToWorld(l: Point2D): Point2D {
        return this.mapVectorToGlobal(l).add(this._center);
    }

    mapVectorToGlobal(v: Point2D): Point2D {
        const gx = this._xAxis.x * v.x + this._yAxis.x * v.y;
        const gy = this._xAxis.y * v.x + this._yAxis.y * v.y;

        return new Point2D(gx, gy)
    }

    mapVectorToLocal(v: Point2D): Point2D {
        // https://math.stackexchange.com/a/2306329
        // Since the world vectors are 1,0 and 0,1 the matrix rotation can be simplified to this:
        const lx = this._xAxis.x * v.x + this._xAxis.y * v.y;
        const ly = this._yAxis.x * v.x + this._yAxis.y * v.y;

        return new Point2D(lx, ly);
    }

    mapPointToLocal(g: Point2D): Point2D {
        return this.mapVectorToLocal(g.copy.sub(this._center))
    }


}

