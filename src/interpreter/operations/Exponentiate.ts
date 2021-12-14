import {BinaryOperation} from "./BinaryOperation";

export class Exponentiate extends BinaryOperation {

    async execute(interpreter): Promise<any> {
        interpreter.setRegister(this._target.name, Number(this._op1.value) ** Number(this._op2.value));
    }

}