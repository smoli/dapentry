import Component from "../../Component";
import {AppState} from "../../model/AppState";


export interface ActionResult {
    data: any
}

export abstract class BaseAction {

    private readonly _component: Component;

    protected constructor(component: Component) {
        this._component = component;
    }

    get component(): Component {
        return this._component;
    }

    get appState(): AppState {
        return this.component.getAppState();
    }

    getResourceText(textId:string, ...parameters:Array<any>):string {
        return this.component.getResourceText(textId, ...parameters);
    }

    async execute(data: any): Promise<ActionResult> {
        const isAsync = this._execute.constructor.name === "AsyncFunction";

        let result;
        if (isAsync) {
            result = await this._execute(data);
        } else {
            result = this._execute(data)
        }

        return {data: result};
    }

    protected abstract _execute(data: any): any;
}


