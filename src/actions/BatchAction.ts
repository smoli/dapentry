import {BaseAction} from "./BaseAction";

export class BatchAction extends BaseAction {
    private readonly _actions: BaseAction[];

    constructor(...actions:Array<BaseAction>) {
        super();
        this._actions = actions;
    }

    protected async _execute(data: any): Promise<any> {
        for (let a of this._actions) {
            await a.execute(data);
        }
    }
}