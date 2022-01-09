import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {GrObject} from "../../Geo/GrObject";
import {GfxOperation} from "./GfxOperation";

export class GfxStroke extends GfxOperation {
    private _value: Parameter;



    constructor(opcode: string, object: Parameter, value: Parameter) {
        super(opcode, object);

        this._value = value;
    }

    get value(): number {
        return this._value.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.target.strokeWidth = this.value;
    }
}