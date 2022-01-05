import {Parameter} from "../interpreter/Parameter";
import {Style} from "../../controls/drawing/Objects/StyleManager";
import {GfxOperation} from "./GfxOperation";

export class GfxObject extends GfxOperation {

    private _style: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter) {
        super(opcode, target);
        this._style = style;
    }

    get name(): any {
        return null;
        // return this._name.finalized(this.closure)
    }

    get style(): Style {
        const s = this._style.finalized(this.closure) as Style;
        return {... s};
    }

}