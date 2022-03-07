import {RegisterStore} from "./RegisterStore";
import {Operation} from "./Operation";
import {UnknownRegisterError} from "./errors/UnknownRegisterError";

export class StackFrame {

    private _registers: RegisterStore = new RegisterStore();
    private _parent: StackFrame = null;
    protected _operations: Array<Operation> = [];


    constructor(parent: StackFrame = null) {
        this._parent = parent;
    }

    set parent(parent: StackFrame) {
        this._parent = parent;
    }

    get parent(): StackFrame {
        return this._parent;
    }

    private _getRegisterBaseValue(baseName: string): any {
        let ret;
        if (!this._registers.hasRegister(baseName)) {
            if (this._parent) {
                ret = this._parent.getRegister(baseName)
            } else {
                throw new UnknownRegisterError(baseName);
            }
        } else {
            if (!this._registers.hasRegister(baseName)) {
                throw new UnknownRegisterError(baseName);
            }
            ret = this._registers.getRegister(baseName);

            if (typeof ret === "object" && "getValue" in ret) {
                ret = ret.getValue(this);
            }
        }

        return ret;
    }

    public getRegisterWithComponents(name: string, components: Array<string>) {
        let ret = this._getRegisterBaseValue(name);
        let l = 0;
        while (l++ < components.length - 1) {
            ret = ret[components[l]]
        }
        return ret[components[0]]
    }

    public getRegister(name: string): any {
        return this._getRegisterBaseValue(name);
    }

    public hasRegister(name: string):boolean {
        return this._registers.hasRegister(name);
    }

    public setRegisterWithComponents(name: string, components: Array<string>, value: any): void {
        let newValueObject = this._getRegisterBaseValue(name);
        let l = 0;
        while (l++ < components.length - 1) {
            newValueObject = newValueObject[components[l]]
        }

        newValueObject[components[components.length - 1]] = value;
        this._registers.setRegister(name, newValueObject);
    }

    public setRegister(name: string, value: any, tryNonLocal: boolean = false): void {
        if (tryNonLocal && this._parent && this._parent.hasRegister(name)) {
            this._parent.setRegister(name, value, tryNonLocal);
        } else {
            this._registers.setRegister(name, value);
        }
    }


}