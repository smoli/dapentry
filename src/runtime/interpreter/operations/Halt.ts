import {Operation} from "../Operation";
import {Interpreter} from "../Interpreter";

export class Halt extends Operation {


    async execute(interpreter: Interpreter): Promise<any> {
        interpreter.halt();
    }
}