import {Operation} from "../../Operation";
import {Parameter} from "../../Parameter";
import {ArrayIterator} from "../../types/ArrayIterator";
import {Interpreter} from "../../Interpreter";
import {getParameterConfig} from "../../../gfx/GfxOperation";

interface LoopInfo {
    label: string,
    iterator: ArrayIterator,
    loopValueName: string,
    indexName: string,
    iterableName: string,
    list: Array<any>
}

export class ForEach extends Operation {

    private static _info: Array<LoopInfo> = [];

    private _value: Parameter;
    private _target: Parameter;
    private _index: Parameter;

    constructor(opcode: string, target: Parameter, a: Parameter, b: Parameter) {
        super(opcode);

        if (!a && !b) {
            this._value = target;
        }


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

        this._target = new Parameter(true, target.name);
    }

    public static get topLoopInfo():LoopInfo {
        if (!ForEach._info.length) {
            return null;
        }
        return ForEach._info[ForEach._info.length - 1];
    }


    public static endEach(interpreter) {
        if (!ForEach._info.length) {
            throw new Error("Not within a loop");
        }

        interpreter.popStack();
        const info = ForEach._info.pop();

        info.iterator.reset();
    }

    public static clearLoopInfo() {
        ForEach._info = [];
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
        let v = this.value;
        let iterator = v;
        let loopValueName = null;


        if (!this._index) {
            // When we're working directly on the list we check if we're nested
            // within another for each on the same list. We then use that list as
            // our value, because in the current stack frame the value behind the
            // lists name is only one value and not the actual list.
            let outer = ForEach._info.find(i => i.iterableName === this._target.name);
            if (outer) {
                v = outer.list;
                if (v instanceof ArrayIterator) {
                    v = v.array;
                }
            }
        }

        if (!(v instanceof ArrayIterator)) {
            iterator = new ArrayIterator(v);
        }
            loopValueName = this._target.name;

        const labelName = "$FOREACH" + ForEach._info.length;
        interpreter.setLabel(labelName);

        let indexName = null;
        if (this._index) {
            indexName = this._index.name;
        }

        ForEach._info.push({
            label: labelName,
            iterator: iterator as ArrayIterator,
            loopValueName,
            indexName,
            iterableName: this._target.name,
            list: v
        })

        const sf = interpreter.pushStack();
        if (loopValueName) {
            sf.setRegister(loopValueName, iterator.value);
        }

        if (indexName) {
            sf.setRegister(indexName, (iterator as ArrayIterator).index);
        }
    }
}

export class EndForEach extends Operation {
    async execute(interpreter: Interpreter): Promise<any> {
        const info = ForEach.topLoopInfo;

        info.iterator.next();

        if (!info.iterator.done) {
            if (info.loopValueName) {
                this.closure.setRegister(info.loopValueName, info.iterator.value);
            }
            if (info.indexName) {
                this.closure.setRegister(info.indexName, info.iterator.index);
            }
            interpreter.gotoLabel(info.label);
        } else {
            ForEach.endEach(interpreter);
        }
    }

}