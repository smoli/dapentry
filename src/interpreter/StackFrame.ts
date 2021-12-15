import {DependencyTracker} from "./DependencyTracker";
import {RegisterStore} from "./RegisterStore";

export class StackFrame {

    private _dependencies: DependencyTracker = new DependencyTracker();
    private _registers: RegisterStore = new RegisterStore();
    private _parent: StackFrame = null;


    constructor(parent: StackFrame = null) {
        this._parent = parent;
    }

    getRegister(name: string): any {
        if (!this._registers.hasRegister(name)) {
            if (this._parent) {
                return this._parent.getRegister(name)
            } else {
                throw new Error(`Unknown register "${name}"`);
            }
        }

        return this._registers.getRegister(name);
    }

    setRegister(name: string, value: any): void {
        this._registers.setRegister(name, value);
    }




}