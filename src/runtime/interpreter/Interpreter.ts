import {LabelParameter, Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Parser, TokenTypes} from "./Parser";
import {defaultOperationFactory, OperationFactory} from "./OperationFactory";
import {Label} from "./operations/Label";
import {StackFrame} from "./StackFrame";
import {Point2Parameter} from "./types/Point2Parameter";
import {ArrayParameter} from "./types/ArrayParameter";
import {ExpressionParameter} from "./types/ExpressionParameter";
import {AtParameter} from "./types/AtParameter";
import {FuncDecl} from "./operations/FuncDecl";

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

/**
 * Interpreter.
 *
 * Runs programs.
 *
 * Execution control:
 *
 *  - run - runs the whole program from start to finish
 *  - pause - pauses the execution. Only feasible with an operation, see Debug
 *  - resume - resumes a paused execution and run till the end
 *  - pauseAfter - tell the interpreter where to pause before calling run
 *  - next - execute one single statement of a paused execution
 *
 */
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

        return this._currentFrame;
    }

    public popStack(returnRegister: Parameter = null, receiveRegister: Parameter = null) {
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
            } else if (op instanceof FuncDecl) {
                ret[op.label] = i - 1;
            }
        });

        return ret;
    }

    public gotoLabel(labelName) {
        if (this._labels.hasOwnProperty(labelName)) {
            this._globals.setPC(this._labels[labelName]);
        } else {
            throw new Error(`Unknown label "${labelName}`);
        }
    }

    /**
     * Sets a label at the current Program counter. If this is
     * called from an operation the label will point to the
     * statement of that operation. The program will therefore
     * execute the statement after that operation.
     * @param labelName
     */
    public setLabel(labelName) {
        this._labels[labelName] = this.pc;
    }

    /**
     * Pause execution after the statement at the given pc
     * is executed. If it is inside a loop you can specify
     * the amount of times it has to be executed before the
     * program is paused.
     *
     * This setting will persist if you run the program again
     * using `run`.
     *
     * @param pc
     * @param iterations
     */
    public pauseAfter(pc: number, iterations: number = 1) {
        this._pauseAfter = pc;
        this._pauseAtAfterIterations = iterations;
    }

    public clearPauseAfter() {
        this._pauseAfter = Number.MAX_SAFE_INTEGER;
    }


    /**
     * Prepare everything to run the program from the start.
     * This does not start the program execution. This is normally
     * used in conjunction with `next`
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
     *
     * This keeps pauseAfter settings!
     *
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
     * This will override pauseAfter.
     */
    public async resume(): Promise<any> {
        if (this._paused) {
            this._paused = false;
            this._pauseAfter = Number.MAX_SAFE_INTEGER;
            this._pauseAtAfterIterations = Number.MAX_SAFE_INTEGER;
            this._currentHaltIterations = Number.MAX_SAFE_INTEGER;
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
                this._executed = true;
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

    get stopped():boolean {
        return this._executed;
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


    /**
     * Parse a program. The parsing result is stored internally
     * and can then be executed repeatedly.
     * @param program
     */
    public parse(program: (string | Array<string>)): void {

        let lines;
        if (typeof program === "string") {
            lines = program.split("\n");
        } else {
            lines = program;
        }
        lines = lines.filter(s => s.trim().length > 0)

        this._program = lines.map((l, i) => this.parseLine(l, i));
    }

    private makeParameter(token): Parameter {
        switch (token.type) {

            case TokenTypes.REGISTER:   //pass through
            case TokenTypes.NUMBER:     //pass through
            case TokenTypes.STRING:
                return new Parameter(token.type === TokenTypes.REGISTER, token.value);

            case TokenTypes.NONLOCALREGISTER:
                return new Parameter(token.type === TokenTypes.NONLOCALREGISTER, token.value, true);

            case TokenTypes.REGISTERAT:
                return new AtParameter(token.value[0].value, token.value[1].value, token.value[1].type);

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

    private parseLine(line: string, index:number): any {
        const tokens = Parser.parseLine(line, index);

        let opcode = null;

        const parts = tokens.map((token, i) => {

            switch (token.type) {
                case TokenTypes.OPCODE:
                    opcode = token.value;
                    return null;

                case TokenTypes.FUNCDECL:
                    opcode = "___FUNC___";
                    return new Parameter(false, token.value);

                case TokenTypes.LABEL:
                    if (i === 0) {
                        opcode = "___LBL___";
                    }
                    return new LabelParameter(false, token.value);

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
