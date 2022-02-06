import {GfxOperation} from "./GfxOperation";
import {Parameter} from "../interpreter/Parameter";

export class GfxStrokeColor extends GfxOperation {
    private readonly _color: Parameter;

    constructor(opcode: string, object: Parameter, color: Parameter) {
        super(opcode, object);
        this._color = color;

    }

    get color(): string {
        return this._color.finalized(this.closure);
    }

    async execute(): Promise<any> {
        this.target.strokeColor = this.color;
    }
}