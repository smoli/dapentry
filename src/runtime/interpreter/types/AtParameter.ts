import {Parameter} from "../Parameter";
import {TokenTypes} from "../Parser";
import {StackFrame} from "../StackFrame";

export type WHERE_VALUE = (number|string);

export class AtParameter extends Parameter {
    private readonly _where:(number|string)
    private _whereType: TokenTypes;

    constructor(name: string, where: WHERE_VALUE, whereType: TokenTypes) {
        super(true, name)
        this._where = where;
        this._whereType = whereType;
    }

    get where():string|number {
        return this._where;
    }

    finalized(closure:StackFrame): any {

        if (this._whereType === TokenTypes.REGISTER) {
            const v = Number(closure.getRegister(this._where as string));
            if (!isNaN(v)) {
                return closure.getRegister(this.name).at(v);
            }
        }

        return closure.getRegister(this.name).at(this._where);
    }

}