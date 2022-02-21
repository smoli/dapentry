import {AppController} from "../core/AppController";
import {State} from "../state/State";
import {NOT_IMPLEMENTED, UNREACHABLE} from "../core/Assertions";

export interface ActionResult {
    data: any
}

export abstract class BaseAction {

    private _controller: AppController;


    set controller(component: AppController) {
        if (this._controller) {
            UNREACHABLE("Do not reset the controller");
        }
        this._controller = component;
    }

    get controller(): AppController {
        return this._controller;
    }

    get state(): State {
        return this._controller.state;
    }

    getResourceText(textId: string, ...parameters: Array<any>): string {
        // TODO: Need a replacement for this
        return textId;
    }

    async execute(data: any): Promise<ActionResult> {

        const result = await this._execute(data);

        return { data: result };
    }


    protected addOrInsertStatement(code) {
        const selectedCode = this.state.store.state.code.selectedLines;

        if (selectedCode.length) {
            const index = Math.max(...selectedCode);
            this.state.insertStatements(index + 1, ...code);
        } else {
            this.state.addCode(code);
        }
    }

    protected _execute(data: any): any {
        NOT_IMPLEMENTED()
    }
}