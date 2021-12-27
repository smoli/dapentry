import {Parameter} from "../Parameter";

export class Point2Parameter extends Parameter{

    private _x: Parameter;
    private _y: Parameter;

    constructor(x: Parameter, y: Parameter) {
        super(false, null)
        this._x = x;
        this._y = y;
    }

    get value(): any {
        return {
            x: this._x,
            y: this._y
        }
    }

    finalized(closure): any {
        return {
            x: this._x.finalized(closure),
            y: this._y.finalized(closure)
        }
    }

}