import {Parameter} from "../Parameter";

export class ExpressionParameter extends Parameter {
    private _expression: string;
    private _usedProps: { [key: string]: Parameter } = {};


    constructor(expression: string) {
        super(false, null)
        this._expression = expression;
        this.parseExpression();
    }

    protected getUsedRegisters() {
        return this._expression.match(/[a-zA-Z][a-zA-Z0-9.-]*/g);
    }

    protected parseExpression() {
        let nameCount = 0;
        this._usedProps = {};

        const regs = this.getUsedRegisters();
        if (!regs) {
            return;
        }
        for (let r of regs) {
            const p = new Parameter(true, r);
            const name = "r" + (nameCount++);
            this._usedProps[name] = p;
            this._expression = this._expression.replace(r, name);
        }
    }

    get value(): any {
        throw new Error("get value not implemented on ExpressionParameter")
    }

    finalized(closure): any {
        let decl = "";

        Object.keys(this._usedProps)
            .forEach(name => {
                const v = this._usedProps[name].finalized(closure);
                if (v === undefined) {
                    throw new Error("Unknown register " + this._usedProps[name].name);
                }
                decl += `var ${name} = ${v};`
            })
        return eval(decl + this._expression);
    }

}