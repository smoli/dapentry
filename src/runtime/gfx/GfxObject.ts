import {Parameter} from "../interpreter/Parameter";
import {Style} from "../../core/StyleManager";
import {GfxOperation} from "./GfxOperation";
import {GrObjectList} from "../../geometry/GrObjectList";
import {GrCompositeObject} from "../../geometry/GrCompositeObject";

export class GfxObject extends GfxOperation {

    private _style: Parameter;

    constructor(opcode: string, target: Parameter, style: Parameter) {
        super(opcode, target);
        this._style = style;
    }

    get style(): Style {
        const s = this._style.finalized(this.closure) as Style;
        return {... s};
    }

}

export class GfxObjectList extends GfxOperation {

    constructor(opcode:string, target: Parameter) {
        super(opcode, target);
    }

    async execute(): Promise<any> {
        this.target = new GrObjectList(this.targetName)
    }
}


export class GfxComposite extends GfxOperation {

    constructor(opcode:string, target: Parameter) {
        super(opcode, target);
    }

    async execute(): Promise<any> {
        this.target = new GrCompositeObject(this.targetName)
    }
}