import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {UpdateStatement} from "../../src/actions/UpdateStatement";

describe('Update statement', () => {

    it('switches a do to a foreach if the new value is an array register', () => {
        const action = new UpdateStatement(1, 1, -1, "a");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("a", [1, 2, 3, 4]);

        const code = `LOAD r1, 10
        DO 2
        ADD r1, 2
        ENDDO`.split("\n").map(s => s.trim());

        state.setCode(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "FOREACH a",
            "ADD r1, 2",
            "ENDEACH"
        ])
    });


});