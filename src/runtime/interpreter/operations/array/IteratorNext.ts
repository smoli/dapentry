import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";

export class IteratorNext extends Operation {

    private readonly _iterator: Parameter;

    constructor(opcode, iterator: Parameter) {
        super(opcode);
        this._iterator = iterator;
    }

    get iterator(): ArrayIterator {
        return this._getParam(this._iterator);
    }

    async execute(interpreter): Promise<any> {
        this.iterator.next();
    }

}