import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {UpdateStatement} from "../../src/actions/UpdateStatement";
import {LoopStatements} from "../../src/actions/LoopStatements";

describe('Loop statement', () => {

    it('Wraps the selected statement in a do/enddo', () => {
        const action = new LoopStatements([1, 2])
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        const code = `
        LOAD r1, 10
        ADD r1, 2
        ADD r1, 3
        `;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ADD r1, 3",
            "ENDDO"
        ])
    });

    xit("Will wrap code that already contains a loop", () => {
        const action = new LoopStatements([1, 2, 3, 4])
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        const code = `
        LOAD r1, 10
        DO 2
        ADD r1, 2
        ADD r1, 3
        ENDDO
        `;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "DO 2",
            "ADD r1, 2",
            "ADD r1, 3",
            "ENDDO",
            "ENDDO"
        ])
    });

    xit("Will wrap code that contains a forEach", () => {
        const action = new LoopStatements([2, 3, 4, 5])
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        const code = `
        LOAD r1, 10
        LOAD r2, [1, 2, 3, 4]
        FOREACH r2
        ADD r1, 2
        ADD r1, 3
        ENDEACH
        `;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "LOAD r2, [1, 2, 3, 4]",
            "DO 2",
            "FOREACH r2",
            "ADD r1, 2",
            "ADD r1, 3",
            "ENDEACH",
            "ENDDO"
        ])
    });

    it("will not wrap a code selection that contains an incomplete loop", () => {
        const action = new LoopStatements([2, 3, 4])
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        const code = `
        LOAD r1, 10
        LOAD r2, [1, 2, 3, 4]
        FOREACH r2
        ADD r1, 2
        ADD r1, 3
        ENDEACH
        `;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "LOAD r2, [1, 2, 3, 4]",
            "FOREACH r2",
            "ADD r1, 2",
            "ADD r1, 3",
            "ENDEACH"
        ])
    });


});