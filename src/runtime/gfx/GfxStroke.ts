import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../controls/drawing/Objects/GrObject";

export class GfxStroke extends Operation {
    private readonly _object: Parameter;
    private _value: Parameter;



    constructor(opcode: string, object: Parameter, value: Parameter) {
        super(opcode);

        this._object = object;
        this._value = value;
    }

    get object(): GrObject {
        return this._getParam(this._object);
    }

    get value(): number {
        return this._value.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.object.strokeWidth = this.value;
    }
}