import {Parameter} from "../Parameter";
import {ArrayParameter} from "./ArrayParameter";

export interface IteratorState { index: number; value: any; done: boolean }

export class ArrayIterator extends Parameter {

    private _array: Array<any>;
    private _index: number;
    private _max: number;

    constructor(value:Array<any>) {
        super(false, null)


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

    get array():Array<any> {
        return this._array;
    }

    get index():number {
        return this._index;
    }

    get value():any {
        return this.atIndex(this._index);
    }

    getComponentValue(components: Array<string>):any {
        let v:any = this.value;

        if (components[0] === "value") {
            v = this;
        }

        for (const c of components) {
            v = v[c];
        }

        return v;
    }

    reset() {
        this._index = 0;
    }

    finalized(closure): any {
        return this.value
    }


}