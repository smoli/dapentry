import {describe, it} from "mocha";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {LoadFromLibrary} from "../../src/actions/LoadFromLibrary";
import {DataFieldType} from "../../src/state/modules/Data";
import {expect} from "chai";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {AspectRatio} from "../../src/geometry/AspectRatio";
import {LoadFieldFromCSV} from "../../src/actions/LoadFieldFromCSV";

describe('Load field from CSV action', () => {

    it('sets a field value to the data in a CSV string', async () => {
        const csv =
`x,y
1,2
2,3
3,4`;

        const action = new LoadFieldFromCSV("f1", csv);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state, null, new GfxInterpreter());

        state.addDataField("f1", 45);

        await action.execute(null);

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1",
                value: [
                    { x: 1, y: 2 },
                    { x: 2, y: 3 },
                    { x: 3, y: 4 }
                ],
                type: DataFieldType.Table,
                description: null,
                published: true
            }]);
    });

});