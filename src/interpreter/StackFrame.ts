import {RegisterStore} from "./RegisterStore";

export class StackFrame {

    private _registers: RegisterStore = new RegisterStore();
    private _parent: StackFrame = null;


    constructor(parent: StackFrame = null) {
        this._parent = parent;
    }

    public close(...registers:Array<string>): void {
        if (this._parent) {
            registers.forEach(name => {
                if (!this._registers.hasRegister(name)) {
                    this._registers.setRegister(name, this.getRegister(name))
                }
            })

            this._parent = null;
        }
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