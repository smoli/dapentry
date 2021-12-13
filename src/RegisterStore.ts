interface RegisterMap {
    [key: string]: any
}

export class RegisterStore {

    private registers: RegisterMap = {}


    constructor() {
    }

    public reset(): void {
        this.registers = {}
    }

    public setRegister(name: string, value: any): void {
        this.registers[name] = value;
    }

    public getRegister(name: string): any {
        return this.registers[name]
    }
}