import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";
import {DialogCloseReason, ModalFactory} from "../../src/ui/core/ModalFactory";
import {InfoModalOptions} from "../../src/ui/core/InfoModal";
import {ConfirmationModalOptions} from "../../src/ui/core/ConfirmationModal";

export class MockController extends AppController {
    private _onConfirm: () => DialogCloseReason;

    constructor(state: State, onConfirm: () => DialogCloseReason = () => DialogCloseReason.YES) {
        super(state, null, null)
        this._onConfirm = onConfirm;
    }

    get modalFactory(): ModalFactory {

        const  onConfirm = this._onConfirm;

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
                        return Promise.resolve(reason);
                    }
                }
            }
        } as unknown as ModalFactory;
    }
}