import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {ArrayIterator} from "../types/ArrayIterator";
import {StackFrame} from "../StackFrame";
import {Interpreter} from "../Interpreter";
import {getParameterConfig} from "../../gfx/GfxOperation";

interface LoopInfo {
    label: string,
    iteration: number,
    maxIterations: number,
    valueName: string
}

export class Do extends Operation {

    private static _info: Array<LoopInfo> = [];

    private _value: Parameter;
    private _target: Parameter;

    constructor(opcode: string, target: Parameter, a: Parameter) {
        super(opcode);

        this._value = a;
        this._target = target;
    }

    public static get topLoopInfo():LoopInfo {
        if (!Do._info.length) {
            return null;
        }
        return Do._info[Do._info.length - 1];
    }


    public static endDo() {
        if (!Do._info.length) {
            throw new Error("Not within a loop");
        }

        Do._info.pop();
    }

    get value(): any {
        return this._value.finalized(this.closure);
    }

    get target(): any {
        return this._getParam(this.target);
    }

    set target(value: any) {
        this._setParam(this._target, value);
    }

    async execute(interpreter: Interpreter): Promise<any> {
        const iteration = 0;
        const max = this.value;

        const labelName = "$DO" + Do._info.length;
        interpreter.setLabel(labelName);

        const valueName = this._target.name;

        Do._info.push({
            label: labelName,
            iteration,
            maxIterations: max,
            valueName
        })

        const sf = new StackFrame();
        interpreter.pushStack(sf);
        sf.setRegister(valueName, iteration);
    }
}

export class EndDo extends Operation {

    async execute(interpreter: Interpreter): Promise<any> {

        const info = Do.topLoopInfo;

        info.iteration++;

        if (info.iteration >= info.maxIterations) {
            interpreter.popStack(null)
        } else {
            this.closure.setRegister(info.valueName, info.iteration);
            interpreter.gotoLabel(info.label);
        }
    }

}