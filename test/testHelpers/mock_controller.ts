import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";
import {ModalFactory} from "../../src/ui/core/ModalFactory";
import {InfoModalOptions} from "../../src/ui/core/InfoModal";

export class MockController extends AppController {
    constructor(state: State) {
        super(state, null, null)
    }

    get modalFactory(): ModalFactory {
        return {
            createInfoModal() {
                return {
                    show(options:InfoModalOptions) {
                        console.log("Mocked info modal with ", options)
                        return Promise.resolve()
                    }
                }
            }
        } as unknown as ModalFactory;
    }
}