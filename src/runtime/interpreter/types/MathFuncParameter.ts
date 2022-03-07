import {Parameter} from "../Parameter";
import {Token, TokenTypes} from "../Parser";
import {ArrayIterator} from "./ArrayIterator";


export class MathFuncParameter extends Parameter {
    private _name: string;
    private _value: Parameter;

    constructor(name: string, value: Parameter) {
        super(false, null)
        this._name = name;
        this._value = value;
    }


    finalized(closure): any {
        let value = null;

        if (this._value instanceof Parameter && this._value.isRegister) {
            value = closure.getRegister(this._value.name);

            if (value instanceof ArrayIterator) {
                value = value.array;
            }
        } else {
            value = this._value.finalized(closure);
        }

        if (!Array.isArray(value)) {
            return null
        }

        if (this._value.components) {
            for(const comp of this._value.components) {
                value = value.map(v => v[comp]);
            }
        }

        switch (this._name) {

            case "size":
                return value.length;

            case "max":
                return Math.max(...value);

            case "min":
                return Math.min(...value);

            case "avg":
                return value.reduce((a, b) => a + b) / value.length;

            case "median":
                const s = [...value].sort((a, b) => a - b);
                const c = Math.floor(s.length / 2);

                let r = s[c]

                if (s.length % 2 === 0) {
                    r = r + s[c - 1];
                    return r / 2;
                }

                return r
        }
    }

}