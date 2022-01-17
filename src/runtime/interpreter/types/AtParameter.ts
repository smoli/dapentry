import {Parameter} from "../Parameter";
import {Token, TokenTypes} from "../Parser";

export type WHERE_VALUE = (number|string);

export class AtParameter extends Parameter {
    private readonly _where:(number|string)

    constructor(name: string, where: WHERE_VALUE) {
        super(true, name)
        this._where = where;
    }

    get where():string|number {
        return this._where;
    }

    finalized(closure): any {
        return closure.getRegister(this.name).at(this._where);
    }

}