import {Operation} from "../Operation";
import {Parameter} from "../Parameter";

export class PushStackFrame extends Operation {


    async execute(interpreter): Promise<any> {
        interpreter.pushStack();
    }

}