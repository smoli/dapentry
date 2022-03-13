import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";
import {DialogCloseReason, ModalFactory} from "../../src/ui/core/ModalFactory";
import {InfoModalOptions} from "../../src/ui/core/InfoModal";
import {ConfirmationModalOptions} from "../../src/ui/core/ConfirmationModal";
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";

export function makeMockModalFactory(onConfirm: () => DialogCloseReason = () => DialogCloseReason.YES):ModalFactory {
    return {
        createInfoModal() {
            return {
                show(options:InfoModalOptions) {
                    console.log("Mocked info modal with ", options)
                    return Promise.resolve()
                }
            }
        },

        createConfirmationModal() {
            return {
                show(options: ConfirmationModalOptions) {
                    console.log("Mocked confirmation modal with", options)
                    const reason = onConfirm();
                    console.log("Said ", DialogCloseReason[reason])
                    return Promise.resolve({reason});
                }
            }
        }
    } as unknown as ModalFactory;
}

export class MockController extends AppController {
    private _onConfirm: () => DialogCloseReason;

    constructor(state: State, onConfirm: () => DialogCloseReason = () => DialogCloseReason.YES, intereter: GfxInterpreter = null) {
        super(state, intereter, null)
        this._onConfirm = onConfirm;
    }

    get modalFactory(): ModalFactory {
        return makeMockModalFactory(this._onConfirm)

    }
}