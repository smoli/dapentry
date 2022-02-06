import {BaseAction} from "./BaseAction";
import {GrObject} from "../geometry/GrObject";
import {AppConfig} from "../AppConfig";

export class SetFillColor extends BaseAction {
    private readonly _objectNames: Array<string>;
    private readonly _color: string;

    constructor(objects: Array<GrObject>, color: string) {
        super();
        this._objectNames = objects.map(o => o.name);
        this._color = color;
    }

    protected _execute(data: any): any {
        const opCode = AppConfig.Runtime.Opcodes.Fill;
        const code = this._objectNames.map(n => `${opCode} ${n}, "${this._color}"`)
        this.state.addCode(code);
    }
}