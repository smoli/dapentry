import {BoundingBox, GrObject, ObjectType, POI, POIMap} from "./GrObject";
import {WHERE_VALUE} from "../runtime/interpreter/types/AtParameter";
import {Point2D} from "./Point2D";

class ObjectArray extends Array<GrObject> {
    private _baseName: string;
    private _parent: GrCompositeObject;

    set parent(value: GrCompositeObject) {
        this._parent = value;
    }
    
    set baseName(value:string) {
        this._baseName = value;
    }

    updateNames(baseName:string) {
        const oldName = this._baseName;

        const r = new RegExp("^" + oldName);

        this.baseName = baseName;

        this.forEach((o, i) => {
            o.setParent(this._parent);
            const u = o.uniqueName.replace(r, baseName);
            o.uniqueName = u;
        })
    }

    push(...items:GrObject[]): number {
        const r = super.push(...items);

        items.forEach((obj, i) => {
            obj.uniqueName = `${this._baseName}-${i}-${obj.uniqueName}`;
        })
        return r;
    }

    get last():GrObject {
        if (this.length) {
            return this[this.length - 1];
        }
        return undefined;
    }
}


export class GrCompositeObject extends GrObject {
    protected _objects: ObjectArray;

    constructor(name: string) {
        super(ObjectType.Composite, name, 0, 0);
        this._objects = new ObjectArray();
        this._objects.baseName = this.uniqueName;
        this._objects.parent = this;
    }

    public updateName(baseName: string) {
        this._uniqueName = baseName;
        this._objects.updateNames(baseName);
    }

    copy() {
        const copy = new GrCompositeObject(this._uniqueName);

        copy._objects = this._objects;
        return copy;
    }

    get objects(): Array<GrObject> {
        return this._objects;
    }

    addObject(object:GrObject) {
        this._objects.push(object);
        object.setParent(this);
    }

    get boundingBox(): BoundingBox {
        const boxes = this._objects.map(o => o.boundingBox);

        const w = Math.max(...boxes.map(b => b.w));
        const h = Math.max(...boxes.map(b => b.h));
        const minX = Math.min(...boxes.map(b => b.x));
        const maxX = Math.max(...boxes.map(b => b.x));
        const minY = Math.min(...boxes.map(b => b.y));
        const maxY = Math.max(...boxes.map(b => b.y));

        return {
            h, w,
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
        }
    }

    get pointsOfInterest(): POIMap {
        const bbox = this.boundingBox;

        return {
            [POI.center]: new Point2D(bbox.x, bbox.y)
        }
    }

    at(where: WHERE_VALUE): Point2D {
        return null;
    }
}