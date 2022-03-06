import {Parameter} from "../Parameter";
import {StackFrame} from "../StackFrame";

export class TableParameter extends Parameter {

    private _rows: Array<any> = []
    private _columnNames: Array<any>;

    constructor(rows: Array<any>, columnNames: Array<any>) {
        super(false, null)
        this._rows = rows;
        this._columnNames = columnNames;
    }

    protected _getValue(param: Parameter, closure): any {
        if (param.isRegister) {
            return closure.getRegister(param.name)
        } else {
            return param.value;
        }
    }

    get length(): number {
        return this._rows.length;
    }

    public getAtIndex(index: number, closure: StackFrame): any {
        return this._getValue(this._rows[index], closure);
    }

    /**
     * TODO: This will only be called on tables create by literal. It only works
     * on non-register cell values.
     */
    get value(): any {
        return this._rows.map(v => {
            const row = {}
            const r = v.value as Array<any>;
            r.forEach((v, i) => row[this._columnNames[i]] = v.value);
            return row;
        });
    }

    finalized(closure): any {
        return [...this._rows.map(v => {
            const row = {}
            const r = v.finalized(closure) as Array<any>;
            r.forEach((v, i) => row[this._columnNames[i]] = v);
            return row;
        })]
    }

}