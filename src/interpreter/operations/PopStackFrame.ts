import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class PopStackFrame extends Operation {

    async execute(interpreter): Promise<any> {
        interpreter.popStack();
    }

}