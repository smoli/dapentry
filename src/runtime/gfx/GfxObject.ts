import {Parameter} from "../interpreter/Parameter";
import {Style} from "../../controls/drawing/Objects/StyleManager";
import {GfxOperation} from "./GfxOperation";

export class GfxObject extends GfxOperation {

    private _drawing: Parameter;
    private _name: Parameter;
    private _style: Parameter;

    constructor(opcode: string, drawing: Parameter, target: Parameter, style: Parameter) {
        super(opcode, target);
        this._drawing = drawing;
        this._style = style;
    }

    get name(): any {
        return null;
        // return this._name.finalized(this.closure)
    }

    get drawing(): Array<any> {
        return this._getParam(this._drawing);
    }

    get style(): Style {
        const s = this._style.finalized(this.closure) as Style;
        return {... s};
    }

}