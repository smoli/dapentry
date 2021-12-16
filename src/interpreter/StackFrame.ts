import {RegisterStore} from "./RegisterStore";
import {Operation} from "./Operation";
import {DependencyTracker} from "./DependencyTracker";
import {Interpreter} from "./Interpreter";

export class StackFrame {

    private _registers: RegisterStore = new RegisterStore();
    private _parent: StackFrame = null;
    private _operations: Array<Operation> = [];
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

            this._parent = null;
        }

        return registers;
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

    public getRegister(name: string): any {
        this._addDependency(name);
        if (!this._registers.hasRegister(name)) {
            if (this._parent) {
                return this._parent.getRegister(name)
            } else {
                throw new Error(`Unknown register "${name}"`);
            }
        }

        const r = this._registers.getRegister(name);
        if (typeof r === "object" && "getValue" in r) {
            return r.getValue(this);
        } else {
            return r;
        }
    }

    public setRegister(name: string, value: any): void {
        this._addDependency(name);
        this._registers.setRegister(name, value);
    }


}