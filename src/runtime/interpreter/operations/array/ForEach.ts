import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";
import {StackFrame} from "../../StackFrame";
import {Interpreter} from "../../Interpreter";
import {getParameterConfig} from "../../../gfx/GfxOperation";

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
    private _index: Parameter;

    constructor(opcode: string, target: Parameter, a: Parameter, b: Parameter) {
        super(opcode);


        switch(getParameterConfig(a, b)) {
            case "P":
                if (!a.isRegister) {
                    throw new Error("FOREACH: Only allowed for registers containing arrays")
                }
                this._value = a;

                break;
            case "PP":
                if (!b.isRegister) {
                    throw new Error("FOREACH: Only allowed for registers containing arrays")
                }
                this._value = b;
                this._index = a;

        }

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
        let indexName = null;
        if (this._index) {
            indexName = this._index.name;
        }

        ForEach._info.push({
            label: labelName,
            iterator,
            valueName,
            indexName
        })

        const sf = new StackFrame();
        interpreter.pushStack(sf);
        sf.setRegister(valueName, iterator.value);

        if (indexName) {
            sf.setRegister(indexName, iterator.index);
        }
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