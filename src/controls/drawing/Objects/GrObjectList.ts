import {GrObject, ObjectType} from "./GrObject";

class ObjectArray extends Array<GrObject> {
    private _baseName: string;

    
    set baseName(value:string) {
        this._baseName = value;
    }

    push(...items:GrObject[]): number {
        let index = this.length;

        const r = super.push(...items);

        items.forEach((obj, i) => {
            obj.name = this._baseName + "-" + (index + i);
        })
        return r;
    }
}


export class GrObjectList extends GrObject {
    private readonly _objects: ObjectArray;

    constructor(name: string) {
        super(ObjectType.List, name, 0, 0);
        this._objects = new ObjectArray();
        this._objects.baseName = this.name;
    }

    get objects(): Array<GrObject> {
        return this._objects;
    }
}