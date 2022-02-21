import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {UpdateStatement} from "../../src/actions/UpdateStatement";
import {createDeflateRaw} from "zlib";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {T_NUMBER, T_OPCODE, T_REGISTER, T_REGISTERAT} from "../testHelpers/tokens";

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
            "FOREACH a",
            "ADD r1, 2",
            "ENDEACH"
        ])
    });

    it("switches the where type to register if necessary", async () => {
        const state = new State(createAppStore(), null);
        const action = new UpdateStatement(1, [2, 1], "f1");
        action.controller = new MockController(state);

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


});