import {RegisterStore} from "./RegisterStore";
import {Operation} from "./Operation";
import {DependencyTracker} from "./DependencyTracker";
import {Interpreter} from "./Interpreter";

export class StackFrame {

    private _registers: RegisterStore = new RegisterStore();
    private _parent: StackFrame = null;
    protected _operations: Array<Operation> = [];
    private _currentInstruction: Operation = null;
    private _dependencies: DependencyTracker = new DependencyTracker();
    private _updating: boolean = false;
    private _newDepsForUpdate: Array<string> = [];


    constructor(parent: StackFrame = null) {
        this._parent = parent;
    }

    public close(): Array<string> {
        const registers = this._dependencies.registerNames;

        if (this._parent) {
            registers.forEach(name => {
                if (!this._registers.hasRegister(name)) {
                    this._registers.setRegister(name, this.getRegister(name))
                }
            })

            // this._parent = null;
        }

        return registers;
    }

    set parent(parent: StackFrame) {
        this._parent = parent;
    }

    get parent() {
        return this._parent;
    }

    public addOperations(...operations: Array<Operation>): void {
        // This unrolls loops and may lead to large lists of operation references
        this._operations.push(...operations);
    }

    public setCurrentInstruction(instruction: Operation): void {
        this._currentInstruction = instruction;
    }

    private _addDependency(name: string): any {
        if (this._currentInstruction) {
            this._dependencies.addDependency(name, this._currentInstruction);
        } else if (this._updating) {
            this._newDepsForUpdate.push(name);
        }
    }

    public async update(name: string, value: any, interpreter: Interpreter): Promise<any> {
        this._updating = true;
        this.setCurrentInstruction(null);
        this.setRegister(name, value);

        const deps: Array<Operation> = this._dependencies.getDependencies(name);

        try {
            for (const op of this._operations) {
                if (deps.indexOf(op) !== -1) {
                    this._newDepsForUpdate = [];
                    await op.update(name, interpreter);

                    this._newDepsForUpdate.forEach(name => {
                        const nd = this._dependencies.getDependencies(name)
                        for (const n of nd) {
                            if (deps.indexOf(n) === -1) {
                                deps.push(n);
                            }
                        }
                    });
                    this._newDepsForUpdate = [];
                }
            }
        } catch (e) {
            throw e;
        } finally {
            this._updating = false;
            this._newDepsForUpdate = [];
        }
    }

    private _getRegisterBaseValue(baseName: string): any {

        let ret;
        if (!this._registers.hasRegister(baseName)) {
            if (this._parent) {
                ret = this._parent.getRegister(baseName)
            } else {
                throw new Error(`Unknown register "${baseName}"`);
            }
        } else {
            ret = this._registers.getRegister(baseName);
            if (typeof ret === "object" && "getValue" in ret) {
                ret = ret.getValue(this);
            }
        }

        return ret;
    }

    public getRegisterWithComponents(name: string, components: Array<string>) {
        this._addDependency(name);

        let ret = this._getRegisterBaseValue(name);
        let l = 0;
        while (l++ < components.length - 1) {
            ret = ret[components[l]]
        }
        return ret[components[0]]
    }

    public getRegister(name: string): any {
        this._addDependency(name);
        return this._getRegisterBaseValue(name);
    }

    public setRegisterWithComponents(name: string, components: Array<string>, value: any): void {
        this._addDependency(name);
        let newValueObject = this._getRegisterBaseValue(name);
        let l = 0;
        while (l++ < components.length - 1) {
            newValueObject = newValueObject[components[l]]
        }

        newValueObject[components[components.length - 1]] = value;
        this._registers.setRegister(name, newValueObject);
    }

    public setRegister(name: string, value: any): void {
        this._addDependency(name);
        this._registers.setRegister(name, value);
    }


}