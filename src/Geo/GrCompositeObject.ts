import {BoundingBox, GrObject, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {WHERE_VALUE} from "../runtime/interpreter/types/AtParameter";
import {Point2D} from "./Point2D";

class ObjectArray extends Array<GrObject> {
    private _baseName: string;
    private _parent: GrCompositeObject;
    private _onPush: () => void;

    set parent(value: GrCompositeObject) {
        this._parent = value;
    }

    set baseName(value: string) {
        this._baseName = value;
    }

    set onPush(value: () => void) {
        this._onPush = value;
    }

    updateNames(baseName: string) {
        const oldName = this._baseName;

        const r = new RegExp("^" + oldName);

        this.baseName = baseName;

        this.forEach((o, i) => {
            o.setParent(this._parent);
            const u = o.uniqueName.replace(r, baseName);
            o.uniqueName = u;
        })
    }

    push(...items: GrObject[]): number {
        const r = super.push(...items);

        items.forEach((obj, i) => {
            obj.uniqueName = `${this._baseName}-${i}-${obj.uniqueName}`;
        })
        if (this._onPush) {
            this._onPush();
        }

        return r;
    }

    get last(): GrObject {
        if (this.length) {
            return this[this.length - 1];
        }
        return undefined;
    }
}


export class GrCompositeObject extends GrObject {
    protected _objects: ObjectArray;
    private _width: number;
    private _height: number;


    constructor(name: string) {
        super(ObjectType.Composite, name, 0, 0);
        this._objects = new ObjectArray();
        this._objects.baseName = this.uniqueName;
        this._objects.parent = this;

        this._objects.onPush = () => {
            this.updateSizes();
        }
    }

    public updateName(baseName: string) {
        this._uniqueName = baseName;
        this._objects.updateNames(baseName);
    }

    protected updateSizes() {
        const boxes = this._objects.map(o => o.boundingBox);

        const w = Math.max(...boxes.map(b => b.w));
        const h = Math.max(...boxes.map(b => b.h));
        const minX = Math.min(...boxes.map(b => b.x));
        const maxX = Math.max(...boxes.map(b => b.x));
        const minY = Math.min(...boxes.map(b => b.y));
        const maxY = Math.max(...boxes.map(b => b.y));

        this._width = w;
        this._height = h;
        this._center.x = (minX + maxX) / 2;
        this._center.y = (minY + maxY) / 2;
    }

    copy() {
        const copy = new GrCompositeObject(this._uniqueName);

        copy._objects = this._objects;
        return copy;
    }

    get objects(): Array<GrObject> {
        return this._objects;
    }

    addObject(object: GrObject) {
        this._objects.push(object);
        object.setParent(this);
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
        return {
            h: this._height, w: this._width,
            x: this._center.x,
            y: this._center.y,
        }
    }

    get topLeft(): Point2D {
        return this.makePoint(-this.width / 2, -this.height / 2);
    }

    get topRight(): Point2D {
        return this.makePoint(this.width / 2, -this.height / 2);
    }

    get bottomRight(): Point2D {
        return this.makePoint(this.width / 2, this.height / 2);
    }

    get bottomLeft(): Point2D {
        return this.makePoint(-this.width / 2, this.height / 2);
    }


    pointsOfInterest(purpose:POIPurpose): POIMap {
        return {
            ...super.pointsOfInterest(purpose),
            [POI.topLeft]: this.topLeft,
            [POI.topRight]: this.topRight,
            [POI.bottomLeft]: this.bottomLeft,
            [POI.bottomRight]: this.bottomRight
        }
    }


    movePOI(poi: POI, byVector: Point2D) {
        this._objects.forEach(o => o.movePOI(POI.center, byVector));
        super.movePOI(POI.center, byVector);
    }

    at(where: WHERE_VALUE): Point2D {
        if (typeof where === "string") {
            return this.pointsOfInterest(POIPurpose.MANIPULATION)[POI[where]];
        }

        return null;
    }
}