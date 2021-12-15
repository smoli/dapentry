import {BinaryOperation} from "./BinaryOperation";

export class Multiply extends BinaryOperation {

    async execute(interpreter): Promise<any> {
        this._target.value = this._op1.value * this._op2.value;
    }

}