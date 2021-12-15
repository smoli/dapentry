import {Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Log} from "./operations/Log";
import {Load} from "./operations/Load";
import {Parser, TokenTypes} from "./Parser";
import {DependencyTracker} from "./DependencyTracker";
import {OperationFactory} from "./OperationFactory";
import {Add} from "./operations/math/Add";
import {Sub} from "./operations/math/Sub";
import {Multiply} from "./operations/math/Multiply";
import {Divide} from "./operations/math/Divide";
import {Exponentiate} from "./operations/math/Exponentiate";
import {JumpWhenNotZero} from "./operations/JumpWhenNotZero";
import {Label} from "./operations/Label";
import {Decrement} from "./operations/math/Decrement";
import {JumpWhenNotEqual} from "./operations/JumpWhenNotEqual";
import {StackFrame} from "./StackFrame";
import {PushStackFrame} from "./operations/PushStackFrame";
import {PopStackFrame} from "./operations/PopStackFrame";
import {Debug} from "./operations/Debug";
import {Increment} from "./operations/math/Increment";

type Context = Node;

interface ContextDictionary {
    [key: string]: Context
}


export class Interpreter {

    private contexts: ContextDictionary = {};

    private _stack: Array<StackFrame> = [];
    private _currentFrame: StackFrame;
    private _program: Array<Operation> = [];

    private _executed: boolean = false;
    private _context: Context = null;

    private _dependencies: DependencyTracker = new DependencyTracker();

    private _currentInstruction: Operation = null;
    private _stopped: boolean = false;
    private _operationFactory: OperationFactory;

    private _programCounter: number = 0;
    private _labels: { [key: string]: number } = {};


    constructor() {
        this._operationFactory = new OperationFactory();
        this._operationFactory.addOperationClass("LOG", Log);
        this._operationFactory.addOperationClass("DEBUG", Debug);
        this._operationFactory.addOperationClass("LOAD", Load);
        this._operationFactory.addOperationClass("ADD", Add);
        this._operationFactory.addOperationClass("SUB", Sub);
        this._operationFactory.addOperationClass("DEC", Decrement);
        this._operationFactory.addOperationClass("INC", Increment);
        this._operationFactory.addOperationClass("MUL", Multiply);
        this._operationFactory.addOperationClass("DIV", Divide);
        this._operationFactory.addOperationClass("EXP", Exponentiate);
        this._operationFactory.addOperationClass("JNZ", JumpWhenNotZero);
        this._operationFactory.addOperationClass("JNE", JumpWhenNotEqual);
        this._operationFactory.addOperationClass("PUSHSF", PushStackFrame);
        this._operationFactory.addOperationClass("POPSF", PopStackFrame);
        this._operationFactory.addOperationClass("___LBL___", Label);

        this._currentFrame = new StackFrame(this._currentFrame);
    }

    public addOperation(opcode: string, OpClass: typeof Operation): void {
        this._operationFactory.addOperationClass(opcode, OpClass);
    }

    public pushStack() {
        this._stack.push(this._currentFrame);
        this._currentFrame = new StackFrame(this._currentFrame);
    }

    public popStack() {
        this._currentFrame.close();
        this._currentFrame = this._stack.pop();
    }

    public addContext(name: string, context: Context): void {
        this.contexts[name] = context;
    }

    public switchContext(name: string): void {
        this._context = this.contexts[name];
    }

    public getRegister(name: string): any {
        if (this._currentInstruction) {
            this._dependencies.addDependency(name, this._currentInstruction);
        }
        return this._currentFrame.getRegister(name);
    }

    public setRegister(name: string, value: any): void {
        this._currentFrame.setRegister(name, value);
        if (this._currentInstruction) {
            this._dependencies.addDependency(name, this._currentInstruction);
        } else if (this._executed) {
            const deps = this._dependencies.getDependencies(name);

            const updatedClosures = [];

            deps.forEach(op => {
                if (updatedClosures.indexOf(op.closure) === -1) {
                    op.closure.setRegister(name, value);
                    updatedClosures.push(op.closure);
                }
                op.update(name, this);
            })
        }
    }

    private resetExecution() {
        this._executed = false;
        this._currentInstruction = null;
        this._programCounter = -1;
        this._labels = {};
        this._stack = [];
        this._stopped = false;
        this._currentFrame = new StackFrame();
    }

    public gotoLabel(labelName) {
        if (this._labels[labelName]) {
            this._programCounter = this._labels[labelName];
        } else {
            throw new Error(`Unknown label "${labelName}`);
        }
    }

    public setLabel(labelName) {
        this._labels[labelName] = this._programCounter;
    }

    public async run(): Promise<any> {
        this.resetExecution();
        return this._run();
    }

    public async _run(): Promise<any> {
        try {
            while (this._programCounter < this._program.length - 1) {
                this._programCounter++;
                this._currentInstruction = this._program[this._programCounter];
                this._currentInstruction.setClosure(this._currentFrame);
                await this._currentInstruction.execute(this);

                if (this._stopped) {
                    return false;
                }
            }
        } catch (e) {
            this._currentInstruction = null;
            this._executed = true;
            throw e;
        } finally {
            if (!this._stopped) {
                this._currentInstruction = null;
                this._executed = true;
            }
        }
    }

    public stop(): void {
        this._stopped = true;
    }

    public async resume(): Promise<any> {
        if (this._stopped) {
            this._stopped = false;
            return this._run();
        }
    }

    public parse(program: string): void {
        const lines = program.split("\n").filter(s => s.trim().length > 0);
        this._program = lines.map(l => this.parseLine(l));
    }

    private _addDependencies(registers: Array<Parameter>, operation: Operation): void {
        registers.forEach(r => {
            this._dependencies.addDependency(r.name, operation);
        });
    }

    private parseLine(line: string): any {
        const tokens = Parser.parseLine(line);

        let opcode = null;
        const parts = tokens.map(token => {
            if (token.type === TokenTypes.OPCODE) {
                opcode = token.value;
                return null;
            } else if (token.type === TokenTypes.LABEL) {
                opcode = "___LBL___";
                return new Parameter(false, token.value);
            } else {
                return new Parameter(token.type === TokenTypes.REGISTER, token.value);
            }
        }).filter(p => !!p);

        let operation = this._operationFactory.create(opcode, ...parts);

        this._addDependencies(parts.filter(p => !!p && p.isRegister), operation);

        return operation;
    }


}