import {Parameter} from "../Parameter";
import {IInterpreterType} from "./IInterpreterType";
import {ArrayParameter} from "./ArrayParameter";

export interface IteratorState { index: number; value: any; done: boolean }

export class ArrayIterator implements IInterpreterType {

    private _array: ArrayParameter;
    private _index: number;
    private _max: number;

    constructor(value:ArrayParameter) {
        this._array = value;
        this._index = 0;
        this._max = this._array.length
    }

    protected _getValue(param:Parameter, closure):any {
        if (param.isRegister) {
            return closure.getRegister(param.name)
        } else {
            return param.value;
        }
    }

    public next():void {
        this._index++;
    }

    public get done():boolean {
        return this._index >= this._max;
    }

    private atIndex(index): any {
        return this._array[index];
    }

    get index():number {
        return this._index;
    }

    get value():any {
        return this.atIndex(this._index);
    }

    public getValue(closure): IteratorState {
        return this;
    }

}