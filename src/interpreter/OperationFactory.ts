import {Operation} from "./Operation";

export class OperationFactory {

    private _opClasses:{ [key:string]: (typeof Operation) } = {}

    constructor() {

    }

    addOperationClass(opcode:string, cls:(typeof Operation)):void {
        this._opClasses[opcode] = cls;
    }

    create(opcode, ...params):Operation {
        const Cls:(typeof Operation) = this._opClasses[opcode];

        if (!Cls) {
            throw  new Error(`Unknown opcode "${opcode}"`)
        }

        return new Cls(opcode, ...params);
    }

}