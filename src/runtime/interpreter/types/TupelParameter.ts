import {Parameter} from "../Parameter";
import {Point2D} from "../../../geometry/Point2D";

export class TupelParameter extends Parameter{

    protected _values:Array<Parameter>;

    constructor(values:Array<Parameter>) {
        super(false, null)
        this._values = values;
    }

    get value(): any {
        return this._values;
    }

    finalized(closure): any {
        return this._values.map(v => v.finalized(closure));
    }

}