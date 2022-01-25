import {Operation} from "../Operation";
import {Parameter} from "../Parameter";
import {Interpreter} from "../Interpreter";

interface LoopInfo {
    label: string,
    iteration: number,
    maxIterations: number,
    targetName: string
}

export class Do extends Operation {

    private static _info: Array<LoopInfo> = [];

    private _value: Parameter;
    private _target: Parameter;

    constructor(opcode: string, valueOrTarget: Parameter, value: Parameter = null) {
        super(opcode);

        if (!value) {
            this._value = valueOrTarget
        } else {
            this._value = value;
            this._target = valueOrTarget;
        }
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

        let targetName;

        if (this._target) {
            targetName = this._target.name;
        }

        Do._info.push({
            label: labelName,
            iteration,
            maxIterations: max,
            targetName: targetName
        })

        const sf = this.closure;

        if (targetName) {
            sf.setRegister(targetName, iteration);
        }
    }
}

export class EndDo extends Operation {

    async execute(interpreter: Interpreter): Promise<any> {

        const info = Do.topLoopInfo;

        info.iteration++;

        if (info.iteration < info.maxIterations) {
            if (info.targetName) {
                this.closure.setRegister(info.targetName, info.iteration);
            }
            interpreter.gotoLabel(info.label);
        }
    }

}