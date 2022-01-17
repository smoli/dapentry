import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../Geo/GrObject";
import {getParameterConfig, GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";
import {AtParameter} from "../interpreter/types/AtParameter";
import {Point2D} from "../../Geo/Point2D";

export class GfxMove extends GfxOperation {
    private _vector: Point2Parameter;
    private _targetPoint: Parameter;
    private _movingPoint: Parameter;


    constructor(opcode: string, a: Parameter | AtParameter, b: Point2Parameter | Parameter) {
        let object;

        switch (getParameterConfig(a, b)) {
            case "P2":
                object = a;
                super(opcode, object);
                this._movingPoint = new Parameter(false, POI[POI.center]);
                this._vector = b as Point2Parameter;
                break;

            case "@2":
                object = new Parameter(true, a.name);
                super(opcode, object);
                this._movingPoint = a;
                this._targetPoint = b;
                break;

            case "P@":
                object = a;
                super(opcode, object);
                this._movingPoint = new Parameter(false, POI[POI.center]);
                this._targetPoint = b;
                break;

            case "@@":
                object = new Parameter(true, a.name);
                super(opcode, object);
                this._movingPoint = a;
                this._targetPoint = b;
                break;
        }

    }

    get vector(): any {
        const from = this._movingPoint.finalized(this.closure);
        const to = this._targetPoint.finalized(this.closure);

        return to.copy.sub(from);

    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].movePOI(POI.center, this.vector);
        } else {
            this.target.movePOI(POI.center, this.vector);
        }
    }
}