import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";

export class IteratorNext extends Operation {

    private readonly _iterator: Parameter;

    constructor(opcode, iterator: Parameter) {
        super(opcode);
        this._iterator = iterator;
    }

    protected _getParam(param) {
        let r = null;
        if (param.isRegister) {
            if (param.components) {
                return this.closure.getRegisterWithComponents(param.name, param.components);
            }
            r = this.closure.getRegister(param.name);
        } else {
            r = param.value;
        }

        return r;
    }

    get iterator(): ArrayIterator {
        return this._getParam(this._iterator);
    }

    async execute(interpreter): Promise<any> {
        this.iterator.next();
    }

}