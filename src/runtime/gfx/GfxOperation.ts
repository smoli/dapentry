import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject, POI, POIPurpose} from "../../geometry/GrObject";
import {GrObjectList} from "../../geometry/GrObjectList";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {ArrayParameter} from "../interpreter/types/ArrayParameter";
import {Point2D} from "../../geometry/Point2D";
import {AtParameter} from "../interpreter/types/AtParameter";


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

    get targetExists():boolean {
        return this._paramExists(this._target);
    }

    set target(value) {
        // If an object with the same name already exists, make a GrObjectList
        // containing all objects of the same name.
        // Except for Guid-Objects
        if (this.targetExists && !this.target.isGuide) {
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

    protected objPoiToPoint(obj:GrObject, poi:(number|string)):Point2D {
        if (typeof poi === "number") {
            return obj.getPointAtPercentage(poi);
        } else {
            const p = POI[poi]
            return obj.pointsOfInterest(POIPurpose.MANIPULATION)[p];
        }
    }

}


/**
 * Returns a string that represents the type info for the given parameters
 *
 * If a parameter is of type Point2Parameter it is represented as a '2'.
 * If a parameter is of type ArrayParameter it is represented as an 'A'.
 * If a parameter is of type AtParameter it is represented as a '@'.
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
            return p instanceof AtParameter ? "@" :
                p instanceof Point2Parameter ? "2" :
                p instanceof ArrayParameter ? "A" : "P";
        }).join("");
}