export class InterpreterError extends Error {

    public pc: number = -1;

    constructor(props) {
        super(props);
        this.name = "InterpreterError"
    }


}

