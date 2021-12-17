import {Operation} from "../Operation";

export class PopStackFrame extends Operation {

    async execute(interpreter): Promise<any> {
        interpreter.popStack();
    }

}