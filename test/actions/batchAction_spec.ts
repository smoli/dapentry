import {describe, it} from "mocha";
import {expect} from "chai"
import {AddStatement} from "../../src/actions/AddStatement";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {BatchAction} from "../../src/actions/BatchAction";

describe('Batch action', () => {

    it('executes multiple actions in a sequence', async () => {
        const state = new State(createAppStore(), null);
        const controller = new MockController(state)


        const action1 = new AddStatement(["ADD r1, 30"]);
        action1.controller = controller;
        const action2 = new AddStatement(["ADD r1, 40"]);
        action2.controller = controller;

        const batch = new BatchAction(action1, action2);
        batch.controller = controller;

        state.setCode(["LOAD r1, 10", "ADD r1, 20"])

        await batch.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 20",
            "ADD r1, 30",
            "ADD r1, 40"
        ]);
    });

});