import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";

export class GfxMove extends Operation {
    private readonly _object: Parameter;
    private _vector: Point2Parameter;


    constructor(opcode: string, object: Parameter, vector: Point2Parameter) {
        super(opcode);

        this._object = object;
        this._vector = vector;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get vector(): any {
        return this._vector.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.x += this.vector.x;
        this.object.y += this.vector.y;
    }
}