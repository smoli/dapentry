import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";

export class GfxObject extends Operation {


    private _target: Parameter;
    private _drawing: Parameter;
    private _name: Parameter;

    constructor(opcode:string, drawing:Parameter, target:Parameter, name:Parameter, ) {
        super(opcode);
        this._target = target;
        this._drawing = drawing;
        this._name = name;
    }

    get name():any {
        return this._name.finalized(this.closure)
    }

    get drawing():Array<any> {
        return this._getParam(this._drawing);
    }

    get target(): any {
        return this._getParam(this._target);
    }

    set target(value) {
        this._setParam(this._target, value);
    }
}