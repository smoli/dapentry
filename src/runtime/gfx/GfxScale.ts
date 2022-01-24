import {Parameter} from "../interpreter/Parameter";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";
import {POI, POIPurpose} from "../../Geo/GrObject";
import {Point2D} from "../../Geo/Point2D";

export class GfxScale extends GfxOperation {
    private _factorX: Parameter;
    private _factorY: Parameter;
    private _pivot: Parameter;


    constructor(opcode: string, object: Parameter, a: Parameter, b: Parameter, c:Parameter) {
        super(opcode, object);

        this._factorX = a;
        this._factorY = b;
        this._pivot = c;
    }

    get factorX(): number {
        return this._factorX.finalized(this.closure);
    }

    get factorY(): number {
        return this._factorY.finalized(this.closure);
    }

    get pivot(): Point2D {
        return this.target.pointsOfInterest(POIPurpose.MANIPULATION)[POI[this._pivot.finalized(this.closure)]]
    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].scale(this.factorX, this.factorY, this.pivot);
        } else {
            this.target.scale(this.factorX, this.factorY, this.pivot);
        }
    }
}
