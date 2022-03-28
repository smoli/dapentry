import {AppController} from "../core/AppController";
import {State} from "../state/State";
import {NOT_IMPLEMENTED, UNREACHABLE} from "../core/Assertions";
import {InterpreterError} from "../runtime/interpreter/errors/InterpreterError";
import {Parser, sameToken} from "../runtime/interpreter/Parser";

export interface ActionResult {
    data?: any,
    errors?: Array<Error>
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

        if (result) {
            return { ...result };
        }

        return {}
    }


    protected checkMerge(index: number, code: Array<string>, merge: Array<{ sameTokens: Array<number>}>):boolean {
        let doMerge = true;


        for (let i = 0; i < code.length; i++) {
            const tcurrent = Parser.parseLine(this.state.store.state.code.code[index + i]);
            const tnew = Parser.parseLine(code[i]);

            for (const ti of merge[i].sameTokens) {
                if (!sameToken(tcurrent[ti], tnew[ti])) {
                    doMerge = false;
                    break;
                }
            }

            if (!doMerge) {
                break;
            }
        }

        return doMerge;
    }

    /**
     * Add statement.
     *
     * if merge info is given
     *
     *      for each statement it is checked if the given tokens
     *      have the same value. If this is true for the n statements
     *      before with n being the number of statments added then the
     *      n statements are replaced.
     *
     * @param code
     * @param merge
     * @protected
     */
    protected addOrInsertStatement(code:Array<string>, merge: Array<{ sameTokens: Array<number>}> = null) {
        const selectedCode = this.state.store.state.code.selectedLines;
        let doMerge = false;

        if (merge) {
            let baseIndex;
            if (selectedCode.length) {
                baseIndex = Math.max(...selectedCode) + 1;
            } else {
                baseIndex = this.state.store.state.code.code.length;
            }

            let index = baseIndex - code.length;

            if (this.checkMerge(index, code, merge)) {
                this.state.replaceStatement(index, ...code);
                return;
            }

            // Maybe the next n are the same
            index = baseIndex;
            if (index + code.length <= this.state.store.state.code.code.length) {
                if (this.checkMerge(index, code, merge)) {
                    this.state.replaceStatement(index, ...code);
                    return;
                }
            }
        }


        if (selectedCode.length) {
            const index = Math.max(...selectedCode);
            this.state.insertStatements(index + 1, ...code);
        } else {
            this.state.addCode(code);
        }
    }

    protected async _execute(data: any): (Promise<(ActionResult | void)>) {
        NOT_IMPLEMENTED()
        return null;
    }
}