import {BinaryOperation} from "./BinaryOperation";

export class Sub extends BinaryOperation {

    async execute(interpreter): Promise<any> {
        this.target = this.op1 - this.op2;
    }

}