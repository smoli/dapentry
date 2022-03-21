import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {DataFieldType} from "../../src/state/modules/Data";
import {RenameTableColumn} from "../../src/actions/RenameTableColumn";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {T_OPCODE, T_REGISTER} from "../testHelpers/tokens";

describe('Rename table column field', () => {

    it('renames the tables column and all usages in the code', async () => {
        const action = new RenameTableColumn("f1", "a", "x");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);

        const code = `
                LOAD r1, f1.x
            `;

        state.setCodeString(code);
        await action.execute(null);

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1",
                value: [
                    { x: 1, b: 2 },
                    { x: 2, b: 3 },
                    { x: 3, b: 4 }
                ],
                type: DataFieldType.Table,
                description: null,
                published: true
            }]);

        expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal([
            T_OPCODE("LOAD"),
            T_REGISTER("r1"),
            T_REGISTER("f1.x")
        ])

    });


});