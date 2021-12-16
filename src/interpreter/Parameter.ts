
export class Parameter {
    private readonly _isRegister: boolean = false;
    private readonly _valueOrName: any = null;

    constructor(isRegister:boolean, valueOrName:any) {
        this._valueOrName = valueOrName;
        this._isRegister = isRegister;
    }

    get isRegister(): boolean {
        return this._isRegister
    }

    get value(): any {
        if (this._isRegister) {
            throw new Array(`Parameter "${this._valueOrName}" references a register`);
        }
        return this._valueOrName
    }

    get name(): string {
        if (this._isRegister) {
            return this._valueOrName;
        }
        throw new Error("This param is a value and has no name");
    }
}