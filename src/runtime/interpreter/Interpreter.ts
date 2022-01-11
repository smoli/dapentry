import {Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Parser, TokenTypes} from "./Parser";
import {defaultOperationFactory, OperationFactory} from "./OperationFactory";
import {Label} from "./operations/Label";
import {StackFrame} from "./StackFrame";
import {Point2Parameter} from "./types/Point2Parameter";
import {ArrayParameter} from "./types/ArrayParameter";
import {ExpressionParameter} from "./types/ExpressionParameter";

class GlobalStackFrame extends StackFrame {

    private _data: { [key: string]: any } = {
        pc: -1
    }

    getRegister(name: string): any {
        return this._data[name]
    }

    getPC(): number {
        return this._data.pc
    }

    setPC(value: number) {
        this._data.pc = value;
    }

}

export class Interpreter {

    private _stack: Array<StackFrame> = [];
    private _currentFrame: StackFrame;
    protected _program: Array<Operation> = [];

    private _executed: boolean = false;

    private _currentInstruction: Operation = null;
    private _paused: boolean = false;
    private _operationFactory: OperationFactory;

    private _globals: GlobalStackFrame = new GlobalStackFrame();
    private _labels: { [key: string]: number } = {};
    private _pauseAfter: number = Number.MAX_SAFE_INTEGER;
    private _pauseAtAfterIterations: number;
    private _currentHaltIterations: number;


    constructor() {
        this._operationFactory = defaultOperationFactory();
        this._currentFrame = this._globals;
    }

    public addOperation(opcode: string, OpClass: typeof Operation): void {
        this._operationFactory.addOperationClass(opcode, OpClass);
    }

    public pushStack(newFrame?: StackFrame) {
        if (this._currentFrame) {
            this._stack.push(this._currentFrame);
        }

        if (newFrame) {
            newFrame.parent = this._currentFrame;
            this._currentFrame = newFrame;
        } else {
            this._currentFrame = new StackFrame(this._currentFrame);
        }
    }

    public popStack(returnRegister: Parameter, receiveRegister: Parameter = null) {
        if (this._executed) {
            return;
        }

        let returnValue;

        if (returnRegister && receiveRegister) {
            if (returnRegister.components) {
                returnValue = this._currentFrame.getRegisterWithComponents(returnRegister.name, returnRegister.components)
            } else {
                returnValue = this._currentFrame.getRegister(returnRegister.name)
            }
        }

        this._currentFrame = this._stack.pop();

        if (receiveRegister) {
            if (receiveRegister.components) {
                this._currentFrame.setRegisterWithComponents(receiveRegister.name, receiveRegister.components, returnValue);
            } else {
                this._currentFrame.setRegister(receiveRegister.name, returnValue);
            }
        }
    }

    public getRegister(name: string): any {
        return this._currentFrame.getRegister(name);
    }

    private _resetExecution() {
        this._executed = false;
        this._currentInstruction = null;
        this.setPC(-1);
        this._labels = this._prepareLabels();
        this._globals = new GlobalStackFrame();
        this._stack = [];
        this._paused = false;
        this._currentFrame = this._globals;
        this._currentHaltIterations = Number.MAX_SAFE_INTEGER;

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
            this._globals.setPC(this._labels[labelName]);
        } else {
            throw new Error(`Unknown label "${labelName}`);
        }
    }

    public setLabel(labelName) {
        this._labels[labelName] = this.pc;
    }

    public pauseAfter(pc: number, iterations: number = 1) {
        this._pauseAfter = pc;
        this._pauseAtAfterIterations = iterations;
    }

    public clearPauseAfter() {
        this._pauseAfter = Number.MAX_SAFE_INTEGER;
    }


    /**
     * Prepare everything to run the program from the start.
     * @param registers
     */
    public start(registers?: { [key: string]: any }) {
        this._resetExecution();
        this.pushStack();

        if (registers) {
            Object.keys(registers)
                .forEach(name => {
                    this._currentFrame.setRegister(name, registers[name])
                })
        }
    }

    /**
     * Run the program from the start till the end or until the specified
     * wait point is reached.
     * @param registers
     */
    public async run(registers?: { [key: string]: any }): Promise<any> {
        this.start(registers);
        return await this._run();
    }

    /**
     * Halt execution. Cannot be resumed.
     */
    public halt(): void {
        this.setPC(this._program.length);
    }

    /**
     * Stop the execution. Can be resumed.
     */
    public pause(): void {
        this._paused = true;
    }

    /**
     * Resume a stopped execution. Does nothing if the
     * program isn't stopped.
     */
    public async resume(): Promise<any> {
        if (this._paused) {
            this._paused = false;
            return this._run();
        }
    }

    /**
     * Try to execute the next statement of a paused program
     * This will override pauseAfter
     * @param steps         How many steps to execute
     */
    public async next(steps: number = 1): Promise<boolean> {
        this._pauseAfter = Number.MAX_SAFE_INTEGER;
        this._pauseAtAfterIterations = Number.MAX_SAFE_INTEGER;
        this._currentHaltIterations = Number.MAX_SAFE_INTEGER;
        return this._next(steps);
    }

    protected async _next(steps: number = 1): Promise<boolean> {
        let n = steps;

        while (n--) {
            let programCounter = this._globals.getPC();
            programCounter++;

            if (programCounter >= this._program.length) {
                return true;
            }

            if (programCounter == this._pauseAfter) {
                this._currentHaltIterations--;
            }

            this._globals.setPC(programCounter);
            await this._step();

            if (this._currentHaltIterations === 0) {
                this._paused = true;
                return false;
            }
        }
        return false;
    }

    /**
     * Set program counter.
     * @param value
     */
    public setPC(value: number) {
        this._globals.setPC(value);
    }

    /**
     * Get current program counter.
     */
    public get pc(): number {
        return this._globals.getPC();
    }

    /**
     * Execute the next statement
     * @protected
     */
    protected async _step(): Promise<any> {
        let programCounter = this._globals.getPC();
        this._currentInstruction = this._program[programCounter];
        if (this._currentInstruction) {
            this._currentInstruction.setClosure(this._currentFrame);
            await this._currentInstruction.execute(this);

            if (this._paused) {
                return false;
            }
        }
    }


    protected async _run(): Promise<any> {
        this._currentHaltIterations = this._pauseAtAfterIterations;
        try {
            while (true) {
                const done = await this._next();
                if (done) {
                    break;
                }
                if (this._paused) {
                    break;
                }
            }
        } catch (e) {
            this._currentInstruction = null;
            this._executed = true;
            throw e;
        } finally {
            if (!this._paused) {
                this._currentInstruction = null;
                this._executed = true;
            }
        }
    }


    public parse(program: (string | Array<string>)): void {

        let lines;
        if (typeof program === "string") {
            lines = program.split("\n");
        } else {
            lines = program;
        }
        lines = lines.filter(s => s.trim().length > 0)

        this._program = lines.map(l => this.parseLine(l));
    }

    private makeParameter(token): Parameter {
        switch (token.type) {

            case TokenTypes.REGISTER:   //pass through
            case TokenTypes.NUMBER:     //pass through
            case TokenTypes.STRING:
                return new Parameter(token.type === TokenTypes.REGISTER, token.value)

            case TokenTypes.POINT:
                return new Point2Parameter(
                    this.makeParameter(token.value[0]),
                    this.makeParameter(token.value[1])
                )

            case TokenTypes.ARRAY:
                return new ArrayParameter(
                    (token.value as Array<any>).map(token => this.makeParameter(token))
                )

            case TokenTypes.ANNOTATION:
                // Annotations are ignored for execution
                break;

            case TokenTypes.EXPRESSION:
                return new ExpressionParameter(token);

            case TokenTypes.OTHER:
                break;
        }
    }

    private parseLine(line: string): any {
        const tokens = Parser.parseLine(line);

        let opcode = null;

        const parts = tokens.map((token, i) => {

            switch (token.type) {
                case TokenTypes.OPCODE:
                    opcode = token.value;
                    return null;

                case TokenTypes.LABEL:
                    if (i === 0) {
                        opcode = "___LBL___";
                    }
                    return new Parameter(false, token.value);

                default:
                    return this.makeParameter(token)
            }
        }).filter(p => !!p);

        if (!opcode) {
            return null;
        }
        return this._operationFactory.create(opcode, ...parts);
    }


}
