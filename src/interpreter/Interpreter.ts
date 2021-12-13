import {RegisterStore} from "./RegisterStore";
import {Parameter} from "./Parameter";
import {Operation} from "./Operation";
import {Debug} from "./operations/Debug";
import {Load} from "./operations/Load";
import {Parser, TokenTypes} from "./Parser";
import {DependencyTracker} from "./DependencyTracker";

type Context = Node;

interface ContextDictionary {
    [key: string]: Context
}


export class Interpreter {

    private contexts: ContextDictionary = {};

    private _registers: RegisterStore = new RegisterStore();
    private _program: Array<Operation> = [];

    private _executed: boolean = false;
    private _context: Context = null;

    private _dependencies: DependencyTracker = new DependencyTracker();

    private _currentInstruction: Operation = null;


    constructor() {
    }

    public addContext(name: string, context: Context): void {
        this.contexts[name] = context;
    }

    public switchContext(name: string): void {
        this._context = this.contexts[name];
    }

    public getRegister(name: string): any {
        return this._registers.getRegister(name);
    }

    public setRegister(name: string, value: any): void {
        this._registers.setRegister(name, value);
        if (this._currentInstruction) {
            this._dependencies.addDependency(name, this._currentInstruction);
        } else if (this._executed) {
            const deps = this._dependencies.getDependencies(name);

            deps.forEach(op => {
                op.update(name, this);
            })
        }
    }

    private resetExecution() {
        this._executed = false;
        this._currentInstruction = null;
    }

    public async run(): Promise<any> {
        this.resetExecution();
        let pc = 0;

        try {
            while (pc < this._program.length) {
                this._currentInstruction = this._program[pc];
                await this._program[pc].execute(this)
                pc++;
            }
        } catch (e) {
            throw e;
        } finally {
            this._currentInstruction = null;
            this._executed = true;
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
            } else {
                return new Parameter(token.type === TokenTypes.REGISTER, token.value, this);
            }
        })

        let operation = null;

        switch (opcode) {

            case "DEBUG":
                operation = new Debug(opcode, parts[1]);
                break;

            case "LOAD":
                operation = new Load(opcode, parts[1], parts[2])
                break;

            /* case "ADD":
                 instruction =  new OPAdd(opcode, parts[1], parts[2], parts[3])
                 break;

             case "CIRCLE":
                 instruction =  new OPCircle(opcode, parts[1], parts[2], parts[3], parts[4])
                 break;

             case "MOVEA":
                 instruction =  new OPMoveA(opcode, parts[1], parts[2], parts[3])
                 break;

             case "MOVES":
                 instruction =  new OPMoveS(opcode, parts[1], parts[2], parts[3])
                 break;

             case "TEXT":
                 instruction =  new OPText(opcode, parts[1], parts[2], parts[3], parts[4])
                 break;

             case "CONTEXT":
                 instruction = new OPSwitchContext(opcode, parts[1]);
                 break;

             case "INPUT":
                 instruction = new OPInput(opcode, parts[1], parts[2], parts[3]);
                 break;
 */
            default:
                throw new Error(`Unknown opcode "${opcode}".`)
        }

        this._addDependencies(parts.filter(p => !!p && p.isRegister), operation);

        return operation;
    }


}