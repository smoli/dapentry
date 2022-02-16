import {describe, it} from "mocha";
import {expect} from "chai"
import {AddStatement} from "../../src/actions/AddStatement";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";

describe('Add statement action', () => {

    it('adds a statement at the end', () => {
        const action = new AddStatement(["ADD r1, 30"]);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode(["LOAD r1, 10", "ADD r1, 20"])

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 20",
            "ADD r1, 30"
        ])
    });


    it('inserts a statement after the last selected code line', () => {
        const action = new AddStatement(["ADD r1, 30"]);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode(["LOAD r1, 10", "ADD r1, 20"])
        state.setCodeSelection([0]);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 30",
            "ADD r1, 20"
        ])
    });

});