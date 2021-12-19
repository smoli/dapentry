
export class Parameter {
    private readonly _isRegister: boolean = false;
    private readonly _valueOrName: any = null;
    private readonly _components: Array<string> = null

    constructor(isRegister:boolean, valueOrName:any) {
        this._valueOrName = valueOrName;
        this._isRegister = isRegister;

        if (this._isRegister) {
            this._components = valueOrName.split(".");
            this._valueOrName = this._components.shift();
            if (this._components.length === 0) {
                this._components = null;
            }
        }
    }

    get components(): Array<string> {
        return this._components;
    }

    get isRegister(): boolean {
        return this._isRegister
    }

    get value(): any {
        if (this._isRegister) {
            throw new Error(`Parameter "${this._valueOrName}" references a register`);
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