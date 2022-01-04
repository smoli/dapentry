import {ActionResult, BaseAction} from "./controller/actions/BaseAction";

export class BaseComponentController {

    constructor() {
    }

    async execute(action:BaseAction, data: any = null):Promise<ActionResult> {
        return action.execute(data);
    }
}