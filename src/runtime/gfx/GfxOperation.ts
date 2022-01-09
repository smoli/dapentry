import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject, POI} from "../../Geo/GrObject";
import {GrObjectList} from "../../Geo/GrObjectList";
import {Point2D} from "../../Geo/GeoMath";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";


export class GfxOperation extends Operation {

    protected readonly _target: Parameter;

    constructor(opcode: string, objectOrTarget: Parameter) {
        super(opcode);
        this._target = objectOrTarget;
    }

    get target(): GrObject {
        return this._getParam(this._target);
    }

    get targetName(): string {
        return this._target.name;
    }

    set target(value) {
        if (this.target) {
            if (!(this.target as any instanceof GrObjectList)) {
                const oldValue = this.target;
                this._setParam(this._target, new GrObjectList(this.targetName));
                (this.target as GrObjectList).addObject(oldValue);
            }
            (this.target as GrObjectList).addObject(value);
        } else {
            this._setParam(this._target, value);
        }
    }

    protected objPoiToPoint(obj:Parameter, poi:Parameter):Point2D {
        const p = POI[poi.finalized(this.closure)]
        return obj.finalized(this.closure).pointsOfInterest[p];
    }

}

/**
 * Returns a string that represents the type info for the given parameters
 *
 * If a parameter is of type Point2Parameter it is represented as a '2'.
 * If a parameter is of type ArrayParameter it is represented as an 'A'.
 * If a parameter is of type Parameter it is represented as a 'P'.
 *
 *  So for parameters of types
 *          Parameter, Point2Parameter, Parameter, ArrayParameter
 *
 *  this function will return
 *          "P2PA"
 *
 * @param parameters
 */
export function getParameterConfig(...parameters): string {
    return parameters.filter(p => !!p)
        .map(p => {
            return p instanceof Point2Parameter ? "2" : p instanceof ArrayParameter ? "A" : "P";
        }).join("");
}