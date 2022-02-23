import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {DeleteStatements} from "../../src/actions/DeleteStatements";
import {DialogCloseReason} from "../../src/ui/core/ModalFactory";

describe('Delete statement', () => {

    it('can delete a statement', () => {
        const action = new DeleteStatements(1);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        const code = `
            LOAD r1, 10
            LOAD r2, 20
            LOAD r3, 30
            LOAD r4, 40
        `;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "LOAD r3, 30",
            "LOAD r4, 40"
        ])
    });


    it("will remove all dependent statements when a creation statement is deleted", async () => {
        const action = new DeleteStatements(0);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);
        const code = `
            LOAD r1, 10
            LOAD r2, 20
            ADD r2, r1
            MUL r1, 2
            LOAD r3, r1
            LOAD r4, r3
            LOAD r5, 60
            LOAD r6, r1 + 2
        `

        state.setCodeString(code);

        try {
            await action.execute(null);
        } catch (e) {
            console.log(e.message);
        }

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r2, 20",
            "LOAD r5, 60"
        ])

    })

    it("will do nothing if the user says no", async () => {
        const action = new DeleteStatements(0);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state, () => DialogCloseReason.NO);
        const code = `
            LOAD r1, 10
            LOAD r2, 20
            ADD r2, r1
            MUL r1, 2
            LOAD r3, r1
            LOAD r4, r3
            LOAD r5, 60
            LOAD r6, r1 + 2
        `

        state.setCodeString(code);

        try {
            await action.execute(null);
        } catch (e) {
            console.log(e.message);
        }

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "LOAD r2, 20",
            "ADD r2, r1",
            "MUL r1, 2",
            "LOAD r3, r1",
            "LOAD r4, r3",
            "LOAD r5, 60",
            "LOAD r6, r1 + 2"
        ])

    });

    it('will remove the whole loop when a do statement is deleted',  async () => {
        const action = new DeleteStatements(3);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state, () => DialogCloseReason.NO);
        const code = `
                LOAD r1, 10
                DO 5
                    ADD r1, 10
                    DO 4
                        ADD r1, 1
                    ENDDO
                    ADD r1, 2
                ENDDO
                MUL r1, 2
            `;

        state.setCodeString(code);
        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 5",
            "ADD r1, 10",
            "ADD r1, 2",
            "ENDDO",
            "MUL r1, 2"
        ])
    });

});