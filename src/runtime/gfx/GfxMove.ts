import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject, POI} from "../../controls/drawing/Objects/GrObject";

export class GfxMove extends Operation {

    private readonly _object: Parameter;
    private _vector: Point2Parameter;
    private _poi: Parameter;


    constructor(opcode: string, object: Parameter, poi:Parameter, vector: Point2Parameter) {
        super(opcode);

        this._object = object;
        this._poi = poi;
        this._vector = vector;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get poi(): POI {
        return this._poi.finalized(this._closure);
    }

    get vector(): any {
        return this._vector.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.movePOI(this.poi, this.vector);
    }
}