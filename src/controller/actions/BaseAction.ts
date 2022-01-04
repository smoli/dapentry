

export interface ActionResult {
    data: any
}

export class BaseAction {

    constructor() {
    }

    async execute(data:any):Promise<ActionResult> {
        return Promise.resolve({ data: null})
    }

}