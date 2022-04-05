import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {UpdateStatement} from "../../src/actions/UpdateStatement";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {T_NUMBER, T_OPCODE, T_REGISTER, T_REGISTERAT} from "../testHelpers/tokens";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {DialogCloseReason} from "../../src/ui/core/ModalFactory";

describe('Update statement', () => {

    it('switches a do to a foreach if the new value is an array register', () => {
        const action = new UpdateStatement(1, [1], "a");
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
            "FOREACH $a, a",
            "ADD r1, 2",
            "ENDEACH"
        ])
    });

    it('uses iterator name (by convention) for lists on statements that are within a forEach on that list', async () => {
        const action = new UpdateStatement(2, [2], "a");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("a", [1, 2, 3, 4]);

        const code = `LOAD r1, 10
        FOREACH a
        ADD r1, 2
        ENDEACH`;

        state.setCodeString(code);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "FOREACH a",
            "ADD r1, $a",
            "ENDEACH"
        ])
    });

    it('uses list name for lists on statements that are not within a forEach on that list', async () => {
        const action = new UpdateStatement(4, [2], "a");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("a", [1, 2, 3, 4]);

        const code = `LOAD r1, 10
        FOREACH a
        ADD r1, 2
        ENDEACH
        ADD r1, 2`;

        state.setCodeString(code);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "FOREACH a",
            "ADD r1, 2",
            "ENDEACH",
            "ADD r1, a"
        ])
    })


    it("switches the where type to register if necessary", async () => {
        const state = new State(createAppStore(), null);
        const action = new UpdateStatement(1, [2, 1], "f1");
        action.controller = new MockController(state, null, new GfxInterpreter());

        const code = `
                LOAD r1, 10
                LOAD r2, r1@5
            `

        state.addDataField("f1", 4);
        state.setCodeString(code);

        await action.execute(null);

        expect(state.store.state.code.code.map(p => Parser.parseLine(p))).to.deep.equal([
            [T_OPCODE("LOAD"), T_REGISTER("r1"), T_NUMBER(10)],
            [T_OPCODE("LOAD"), T_REGISTER("r2"), T_REGISTERAT("r1", T_REGISTER("f1"))]
        ]);


    });

    it("can rename a register", async () => {
        const state = new State(createAppStore(), null);
        const action = new UpdateStatement(0, [1], "f1");
        action.controller = new MockController(state);

        const code = `
                LOAD r1, 10
                LOAD r2, r1@5
            `

        state.setCodeString(code);
        await action.execute(null);

        expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal([
                T_OPCODE("LOAD"),
                T_REGISTER("f1"),
                T_NUMBER(10)
            ]);

        expect(Parser.parseLine(state.store.state.code.code[1])).to.deep.equal([
                T_OPCODE("LOAD"),
                T_REGISTER("r2"),
                T_REGISTERAT("f1", 5)
            ]);
    });

    it('user can decide to use a lists current value when used on a do inside a forEach on that list', async () => {
        const action = new UpdateStatement(2, [1], "a");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state, () => DialogCloseReason.NO);

        state.addDataField("a", [1, 2, 3, 4]);

        const code = `LOAD r1, 10
        FOREACH $a, a
        DO 2
        ADD r1, 2
        ENDDO
        ENDEACH`;

        state.setCodeString(code);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "FOREACH $a, a",
            "DO $a",
            "ADD r1, 2",
            "ENDDO",
            "ENDEACH"
        ])
    });

    it('user can decide to use change do to forEach when using a list on a do inside a forEach on that list', async () => {
        const action = new UpdateStatement(2, [1], "a");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state, () => DialogCloseReason.YES);

        state.addDataField("a", [1, 2, 3, 4]);

        const code = `LOAD r1, 10
        FOREACH $a, a
        DO 2
        ADD r1, 2
        ENDDO
        ENDEACH`;

        state.setCodeString(code);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "FOREACH $a, a",
            "FOREACH $a, a",
            "ADD r1, 2",
            "ENDEACH",
            "ENDEACH"
        ])
    });


});