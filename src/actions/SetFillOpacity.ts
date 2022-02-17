import {BaseAction} from "./BaseAction";
import {GrObject} from "../geometry/GrObject";
import {AppConfig} from "../core/AppConfig";

export class SetFillOpacity extends BaseAction {
    private readonly _objectNames: Array<string>;
    private readonly _opacity: number;

    constructor(objects: Array<GrObject>, opacity: number) {
        super();
        this._objectNames = objects.map(o => o.name);
        this._opacity = opacity;
    }

    protected _execute(data: any): any {
        const opCode = AppConfig.Runtime.Opcodes.FillOpacity;
        const code = this._objectNames.map(n => `${opCode} ${n}, "${this._opacity}"`)
        this.addOrInsertStatement(code);
    }
}