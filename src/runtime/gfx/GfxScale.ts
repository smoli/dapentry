import {Parameter} from "../interpreter/Parameter";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../Geo/GrObjectList";

export class GfxScale extends GfxOperation {
    private _factorX: Parameter;
    private _factorY: Parameter;


    constructor(opcode: string, object: Parameter, a: Parameter, b: Parameter) {
        super(opcode, object);

        this._factorX = a;
        this._factorY = b;
    }

    get factorX(): number {
        return this._factorX.finalized(this.closure);
    }

    get factorY(): number {
        return this._factorY.finalized(this.closure);
    }

    async execute(): Promise<any> {
        if (this.target instanceof GrObjectList) {
            this.target.objects[this.target.objects.length - 1].scale(this.factorX, this.factorY);
        } else {
            this.target.scale(this.factorX, this.factorX);
        }
    }
}
