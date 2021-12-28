import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";

export class Append extends Operation {

    private _items:Array<Parameter>;
    private _target: Parameter;

    constructor(opcode: string, target:Parameter, ...items: Array<Parameter>) {
        super(opcode);
        this._items = items;
        this._target = target;
    }

    async execute(): Promise<any> {
        const a = this._getParam(this._target);
        a.push(...this._items.map(i => i.finalized(this.closure)))
    }

}