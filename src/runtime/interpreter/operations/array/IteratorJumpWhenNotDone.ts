import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";

export class IteratorJumpWhenNotDone extends Operation {

    private readonly _iterator: Parameter;
    private readonly _label: Parameter;

    constructor(opcode, iterator: Parameter, label: Parameter) {
        super(opcode);
        this._iterator = iterator;
        this._label = label;
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

    get label(): any {
        return this._label.value
    }

    async execute(interpreter): Promise<any> {
        if (!this.iterator.done) {
            interpreter.gotoLabel(this.label);
        }
    }

}
