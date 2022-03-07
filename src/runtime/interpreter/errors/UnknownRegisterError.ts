import {InterpreterError} from "./InterpreterError";

export class UnknownRegisterError extends InterpreterError {
    public readonly registerName: string;

    constructor(registerName: string) {
        super("Unknown Register " + registerName);

        this.name = "UnknownRegisterError"
        this.registerName = registerName;
    }
}

export class UnknownRegisterComponentError extends InterpreterError {
    public readonly registerName: string;
    public readonly componentName: string;

    constructor(registerName: string, componentName: string) {
        super("Unknown Register component" + registerName + "." + componentName);

        this.name = "UnknownRegisterComponentError"
        this.registerName = registerName;
        this.componentName = componentName;
    }

}
