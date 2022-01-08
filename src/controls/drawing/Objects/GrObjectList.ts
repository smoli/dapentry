import {GrObject, ObjectType, POIMap} from "./GrObject";

class ObjectArray extends Array<GrObject> {
    private _baseName: string;

    
    set baseName(value:string) {
        this._baseName = value;
    }

    push(...items:GrObject[]): number {
        let index = this.length;

        const r = super.push(...items);

        items.forEach((obj, i) => {
            obj.uniqueName = this._baseName + "-" + (index + i);
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


export class GrObjectList extends GrObject {
    private readonly _objects: ObjectArray;

    constructor(name: string) {
        super(ObjectType.List, name, 0, 0);
        this._objects = new ObjectArray();
        this._objects.baseName = this.uniqueName;
    }

    get objects(): Array<GrObject> {
        return this._objects;
    }

    addObject(object:GrObject) {
        this._objects.push(object);
        object.setParent(this);
    }

    get pointsOfInterest(): POIMap {
        if (this._objects.last) {
            return this._objects.last.pointsOfInterest;
        }
        return {};
    }
}