import {Operation} from "../Operation";

export class Debug extends Operation {

    async execute(interpreter): Promise<any> {
        interpreter.pause();
    }
}