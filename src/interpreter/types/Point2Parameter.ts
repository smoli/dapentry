import {Parameter} from "../Parameter";
import {IInterpreterType} from "./IInterpreterType";

export class Point2Parameter implements IInterpreterType {

    private readonly _x: Parameter;
    private readonly _y: Parameter;

    constructor(x: Parameter, y: Parameter) {
        this._x = x;
        this._y = y;
    }

    protected _getValue(param: Parameter, closure): any {
        if (param.isRegister) {
            return closure.getRegister(param.name)
        } else {
            return param.value;
        }
    }

    public getValue(closure) {
        return {
            x: this._getValue(this._x, closure),
            y: this._getValue(this._y, closure)
        }
    }

}