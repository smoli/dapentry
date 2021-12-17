import {Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Parser, TokenTypes} from "./Parser";
import {DependencyTracker} from "./DependencyTracker";
import {defaultOperationFactory, OperationFactory} from "./OperationFactory";
import {Label} from "./operations/Label";
import {StackFrame} from "./StackFrame";
import {Point2Parameter} from "./types/Point2Parameter";

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
        this._operationFactory = defaultOperationFactory();
        this._currentFrame = new StackFrame(this._currentFrame);
    }

    public addOperation(opcode: string, OpClass: typeof Operation): void {
        this._operationFactory.addOperationClass(opcode, OpClass);
    }

    public pushStack() {
        if (this._currentFrame) {
            this._stack.push(this._currentFrame);
        }
        this._currentFrame = new StackFrame(this._currentFrame);
    }

    private _closeCurrentFrame(): void {
        const usedRegisters = this._currentFrame.close();
        usedRegisters.forEach(name => this._dependencies.addDependency(name, this._currentFrame));
    }

    public popStack() {
        this._closeCurrentFrame();
        this._currentFrame = this._stack.pop();
    }

    public addContext(name: string, context: Context): void {
        this.contexts[name] = context;
    }

    public switchContext(name: string): void {
        this._context = this.contexts[name];
    }

    public getRegister(name: string): any {
        return this._currentFrame.getRegister(name);
    }

    public async updateRegister(name: string, value: any): Promise<any> {
        this._currentFrame.setRegister(name, value);

        if (this._executed) {
            const deps: Array<StackFrame> = this._dependencies.getDependencies(name);

            for (const dep of deps) {
                await dep.update(name, value, this);
            }
        }
    }

    private _resetExecution() {
        this._executed = false;
        this._currentInstruction = null;
        this._programCounter = -1;
        this._labels = this._prepareLabels();
        this._stack = [];
        this._stopped = false;
        this._currentFrame = null;

    }

    private _prepareLabels(): { [key: string]: number } {
        const ret = {};
        this._program.forEach((op, i) => {
            if (op instanceof Label) {
                ret[op.label] = i;
            }
        });

        return ret;
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
        this._resetExecution();
        this.pushStack();
        const result = await this._run();

        // We do not pop the outer frame after our program is done,
        // so we can access the final state after execution
        // UNCLEAR: We will still only be able to access the outer frame
        //          will this be enough?
        this._closeCurrentFrame();
        return result;
    }

    public async _run(): Promise<any> {
        try {
            while (this._programCounter < this._program.length - 1) {
                this._programCounter++;
                this._currentInstruction = this._program[this._programCounter];
                this._currentInstruction.setClosure(this._currentFrame);

                // This unrolls loops and may lead to large lists of operation references
                this._currentFrame.addOperations(this._currentInstruction);
                this._currentFrame.setCurrentInstruction(this._currentInstruction)
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
        this._program = lines.map(l => this.parseLine(l)).filter(p => !!p);
    }

    private parseLine(line: string): any {
        const tokens = Parser.parseLine(line);

        let opcode = null;

        const parts = tokens.map(token => {

            switch(token.type) {
                case TokenTypes.OPCODE:
                    opcode = token.value;
                    return null;

                case TokenTypes.REGISTER:   //pass through
                case TokenTypes.NUMBER:     //pass through
                case TokenTypes.STRING:
                    return new Parameter(token.type === TokenTypes.REGISTER, token.value)

                case TokenTypes.LABEL:
                    opcode = "___LBL___";
                    return new Parameter(false, token.value);

                case TokenTypes.POINT:
                    return new Parameter(false, new Point2Parameter(
                        new Parameter(token.value[0].type === TokenTypes.REGISTER, token.value[0].value),
                        new Parameter(token.value[1].type === TokenTypes.REGISTER, token.value[1].value)
                    ))

                case TokenTypes.OTHER:
                    break;

            }
        }).filter(p => !!p);

        if (!opcode) {
            return null;
        }
        return this._operationFactory.create(opcode, ...parts);
    }


}