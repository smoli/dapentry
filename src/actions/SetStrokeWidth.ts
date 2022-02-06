import {BaseAction} from "./BaseAction";
import {GrObject} from "../geometry/GrObject";
import {AppConfig} from "../AppConfig";

export class SetStrokeWidth extends BaseAction {
    private readonly _objectNames: Array<string>;
    private readonly _width: number;

    constructor(objects: Array<GrObject>, width: number) {
        super();
        this._objectNames = objects.map(o => o.name);
        this._width = width;
    }

    protected _execute(data: any): any {
        const opCode = AppConfig.Runtime.Opcodes.StrokeWidth;
        const code = this._objectNames.map(n => `${opCode} ${n}, "${this._width}"`)
        this.state.addCode(code);
    }
}