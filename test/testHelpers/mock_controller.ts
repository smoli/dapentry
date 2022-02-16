import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";

export class MockController extends AppController {
    constructor(state: State) {
        super(state, null, null)
    }
}