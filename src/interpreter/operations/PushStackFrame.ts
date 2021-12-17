import {Operation} from "../Operation";

export class PushStackFrame extends Operation {


    async execute(interpreter): Promise<any> {
        interpreter.pushStack();
    }

}