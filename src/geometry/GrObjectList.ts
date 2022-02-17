import {GrObject, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {WHERE_VALUE} from "../runtime/interpreter/types/AtParameter";
import {Point2D} from "./Point2D";

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
    protected _objects: ObjectArray;

    constructor(name: string) {
        super(ObjectType.List, name, 0, 0);
        this._objects = new ObjectArray();
        this._objects.baseName = this.uniqueName;
    }

    copy() {
        const copy = new GrObjectList(this._uniqueName);

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

    pointsOfInterest(purpose: POIPurpose): POIMap {

        if (purpose === POIPurpose.SCALING) {
            return super.pointsOfInterest(purpose);
        } else if (purpose === POIPurpose.MANIPULATION) {
            if (this._objects.last) {
                return this._objects.last.pointsOfInterest(POIPurpose.MANIPULATION);
            }
        } else if (purpose === POIPurpose.SNAPPING) {
            if (this._objects.length === 1) {
                return this._objects.last.pointsOfInterest(POIPurpose.SNAPPING);
            } else if (this._objects.length > 1) {
                return this._objects[this._objects.length - 2].pointsOfInterest(POIPurpose.SNAPPING)
            }
        } else {
            return {};
        }

    }

    movePOI(poi: POI, byVector: Point2D) {
        if (this._objects.last) {
            return this._objects.last.movePOI(poi, byVector);
        }
    }

    at(where: WHERE_VALUE): (Point2D | string | number) {
        if (!this._objects.last) {
            return null;
        }

        return this._objects.last.at(where);
    }

    get style() {
        if (!this._objects.last) {
            return null;
        }
        return this._objects.last.style;
    }

    get fillOpacity() {
        if (!this._objects.last) {
            return null;
        }
        return this._objects.last.fillOpacity;
    }

    get fillColor() {
        if (!this._objects.last) {
            return null;
        }
        return this._objects.last.fillColor;
    }

    get strokeColor() {
        if (!this._objects.last) {
            return null;
        }
        return this._objects.last.strokeColor;
    }

    get strokeWidth() {
        if (!this._objects.last) {
            return null;
        }
        return this._objects.last.strokeWidth;
    }

    set fillOpacity(value) {
        if (!this._objects.last) {
            return;
        }
        this._objects.last.fillOpacity = value;
    }

    set fillColor(value) {
        if (!this._objects.last) {
            return;
        }
        this._objects.last.fillColor = value;
    }

    set strokeColor(value) {
        if (!this._objects.last) {
            return;
        }
        this._objects.last.strokeColor = value;
    }

    set strokeWidth(value) {
        if (!this._objects.last) {
            return;
        }
        this._objects.last.strokeWidth = value;
    }

}