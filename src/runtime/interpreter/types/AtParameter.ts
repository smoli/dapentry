import {Parameter} from "../Parameter";
import {StackFrame} from "../StackFrame";

export type WHERE_VALUE = (number|string);

export class AtParameter extends Parameter {
    private readonly _where:Parameter

    constructor(name: string, where: Parameter) {
        super(true, name)
        this._where = where;
    }

    get where():string {
        return "" + this._where.value;
    }

    finalized(closure:StackFrame): any {
        const v = this._where.finalized(closure);
        return closure.getRegister(this.name).at(v);
    }

}
