interface RegisterMap {
    [key: string]: any
}

export class RegisterStore {

    private _registers: RegisterMap = {}


    constructor() {
    }

    public reset(): void {
        this._registers = {}
    }

    public setRegister(name: string, value: any): void {
        this._registers[name] = value;
    }

    public getRegister(name: string): any {
        return this._registers[name]
    }

    public hasRegister(name: string): boolean {
        return this._registers.hasOwnProperty(name);
    }
}

