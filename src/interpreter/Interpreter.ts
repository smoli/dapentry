import {Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Parser, TokenTypes} from "./Parser";
import {defaultOperationFactory, OperationFactory} from "./OperationFactory";
import {Label} from "./operations/Label";
import {StackFrame} from "./StackFrame";
import {Point2Parameter} from "./types/Point2Parameter";
import {ArrayParameter} from "./types/ArrayParameter";

class GlobalStackFrame extends StackFrame {

    private _data: { [key: string]: any } = {
        pc: -1
    }

    getRegister(name: string): any {
        return this._data[name]
    }

    getPC():number {
        return this._data.pc
    }

    setPC(value: number) {
        this._data.pc = value;
    }

}

export class Interpreter {

    private _stack: Array<StackFrame> = [];
    private _currentFrame: StackFrame;
    private _program: Array<Operation> = [];

    private _executed: boolean = false;

    private _currentInstruction: Operation = null;
    private _stopped: boolean = false;
    private _operationFactory: OperationFactory;

    private _globals: GlobalStackFrame = new GlobalStackFrame();
    private _labels: { [key: string]: number } = {};


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
        const lclReceiver = receiveRegister ? receiveRegister : returnRegister;

        if (returnRegister) {
            if (returnRegister.components) {
                returnValue = this._currentFrame.getRegisterWithComponents(returnRegister.name, returnRegister.components)
            } else {
                returnValue = this._currentFrame.getRegister(returnRegister.name)
            }
        }

        this._currentFrame = this._stack.pop();

        if (lclReceiver) {
            if (lclReceiver.components) {
                this._currentFrame.setRegisterWithComponents(lclReceiver.name, lclReceiver.components, returnValue);
            } else {
                this._currentFrame.setRegister(lclReceiver.name, returnValue);
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
        this._stopped = false;
        this._currentFrame = this._globals;

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

    public async run(registers?: { [key: string]: any}): Promise<any> {
        this._resetExecution();
        this.pushStack();

        if (registers) {
            Object.keys(registers)
                .forEach(name => {
                    this._currentFrame.setRegister(name, registers[name])
                })
        }

        // We do not pop the outer frame after our program is done,
        // so we can access the final state after execution
        // UNCLEAR: We will still only be able to access the outer frame
        //          will this be enough?
        return await this._run();
    }

    public setPC(value:number) {
        this._globals.setPC(value);
    }

    public get pc():number {
        return this._globals.getPC();
    }

    public async _run(): Promise<any> {
        try {
            while (true) {
                let programCounter = this._globals.getPC();
                programCounter++;

                if(programCounter >= this._program.length) {
                    break;
                }

                this._globals.setPC(programCounter);
                this._currentInstruction = this._program[programCounter];
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
        this._program = lines.map(l => this.parseLine(l)).filter(p => !!p);
    }

    private makeParameter(token): Parameter {
        switch (token.type) {

            case TokenTypes.REGISTER:   //pass through
            case TokenTypes.NUMBER:     //pass through
            case TokenTypes.STRING:
                return new Parameter(token.type === TokenTypes.REGISTER, token.value)

            case TokenTypes.POINT:
                return new Point2Parameter(
                    new Parameter(token.value[0].type === TokenTypes.REGISTER, token.value[0].value),
                    new Parameter(token.value[1].type === TokenTypes.REGISTER, token.value[1].value)
                )

            case TokenTypes.ARRAY:
                return new ArrayParameter(
                    (token.value as Array<any>).map(token => this.makeParameter(token))
                )

            case TokenTypes.OTHER:
                break;
        }
    }

    private parseLine(line: string): any {
        const tokens = Parser.parseLine(line);

        let opcode = null;

        const parts = tokens.map(token => {

            switch (token.type) {
                case TokenTypes.OPCODE:
                    opcode = token.value;
                    return null;

                case TokenTypes.LABEL:
                    opcode = "___LBL___";
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