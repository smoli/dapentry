import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";
import {StackFrame} from "../../StackFrame";
import {Interpreter} from "../../Interpreter";

interface LoopInfo {
    label: string,
    iterator: ArrayIterator,
    valueName: string,
    indexName: string
}

export class ForEach extends Operation {

    private static _info: Array<LoopInfo> = [];

    private _value: Parameter;
    private _target: Parameter;

    constructor(opcode: string, target: Parameter, value: Parameter) {
        super(opcode);

        if (!value.isRegister) {
            throw new Error("FOREACH: Only allowed for registers containing arrays")
        }

        this._value = value;
        this._target = target;
    }

    public static get topLoopInfo():LoopInfo {
        if (!ForEach._info.length) {
            return null;
        }
        return ForEach._info[ForEach._info.length - 1];
    }


    public static endEach() {
        if (!ForEach._info.length) {
            throw new Error("Not within a loop");
        }

        ForEach._info.pop();
    }

    get value(): any {
        return this._getParam(this._value);
    }

    get target(): any {
        return this._getParam(this.target);
    }

    set target(value: any) {
        this._setParam(this._target, value);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const iterator = new ArrayIterator(this.value);
        const labelName = "$FOREACH" + ForEach._info.length;
        interpreter.setLabel(labelName);

        const valueName = this._target.name;
        //const indexName = this._target.name;

        ForEach._info.push({
            label: labelName,
            iterator,
            valueName,
            indexName: null
        })

        const sf = new StackFrame();
        interpreter.pushStack(sf);
        sf.setRegister(valueName, iterator.value);
        //sf.setRegister(indexName, iterator.index);
    }
}

export class EndForEach extends Operation {

    async execute(interpreter: Interpreter): Promise<any> {

        const info = ForEach.topLoopInfo;

        info.iterator.next();

        if (info.iterator.done) {
            interpreter.popStack(null)
        } else {
            this.closure.setRegister(info.valueName, info.iterator.value);
            if (info.indexName) {
                this.closure.setRegister(info.indexName, info.iterator.index);
            }
            interpreter.gotoLabel(info.label);
        }


    }

}