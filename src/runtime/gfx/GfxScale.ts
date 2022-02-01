import {Parameter} from "../interpreter/Parameter";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";
import {POI, POIPurpose} from "../../Geo/GrObject";
import {Point2D} from "../../Geo/Point2D";
import {UNREACHABLE} from "../../Assertions";

export class GfxScale extends GfxOperation {
    private _factorX: Parameter;
    private _factorY: Parameter;
    private _pivot: Parameter;


    constructor(opcode: string, object: Parameter, a: Parameter, b: Parameter, c:Parameter) {
        super(opcode, object);

        switch(getParameterConfig(a, b, c)) {
            case "PPP":
                this._factorX = a;
                this._factorY = b;
                this._pivot = c;
                break;

            case "PP":
                this._factorX = a;
                this._factorY = a;
                this._pivot = b;
                break;

            default:
                UNREACHABLE();
        }

    }

    get factorX(): number {
        return this._factorX.finalized(this.closure);
    }

    get factorY(): number {
        return this._factorY.finalized(this.closure);
    }

    get pivot(): Point2D {
        return this.target.pointsOfInterest(POIPurpose.SCALING)[POI[this._pivot.finalized(this.closure)]]
    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].scale(this.factorX, this.factorY, this.pivot);
        } else {
            this.target.scale(this.factorX, this.factorY, this.pivot);
        }
    }
}
