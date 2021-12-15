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
        }
    }

    public async update(name: string, value: any, interpreter: Interpreter): Promise<any> {
        this.setCurrentInstruction(null);
        this.setRegister(name, value);

        const deps:Array<Operation> = this._dependencies.getDependencies(name);

        for(const op of this._operations) {
            if (deps.indexOf(op) !== -1) {
                await op.update(name, interpreter);
            }
        }

        // for (const op of deps) {
        //     await op.update(name, interpreter);
        // }
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

        return this._registers.getRegister(name);
    }

    public setRegister(name: string, value: any): void {
        this._addDependency(name);
        this._registers.setRegister(name, value);
    }


}