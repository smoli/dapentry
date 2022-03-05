export class Parameter {
    private readonly _isRegister: boolean = false;
    private readonly _valueOrName: any = null;
    private readonly _components: Array<string> = null
    private readonly _isNonLocal: boolean;

    constructor(isRegister: boolean, valueOrName: any, nonLocal: boolean = false) {
        this._valueOrName = valueOrName;
        this._isRegister = isRegister;
        this._isNonLocal = false;

        if (this._isRegister) {
            this._isNonLocal = nonLocal;
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

    get isNonLocal(): boolean {
        return this._isNonLocal;
    }

    get isRegister(): boolean {
        return this._isRegister
    }

    finalized(closure): any {
        let r;
        if (this._isRegister) {
            r = closure.getRegister(this._valueOrName)
        } else {
            r = this._valueOrName;
        }
        if (this.components) {
            if (this.components) {
                if (r.getComponentValue) {
                    r = r.getComponentValue(this.components);
                } else {
                    for (const c of this.components) {
                        r = r[c]
                    }
                }
            }
        }
        if (r && r.finalized) {
            return r.finalized(closure)
        }

        return r;
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

export class LabelParameter extends Parameter {
}