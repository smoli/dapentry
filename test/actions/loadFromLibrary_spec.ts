import {describe, it} from "mocha";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {LoadFromLibrary} from "../../src/actions/LoadFromLibrary";
import {AspectRatio} from "../../src/geometry/GrCanvas";
import {DataFieldType} from "../../src/state/modules/Data";
import {expect} from "chai";

describe('Load from library action', () => {

    it('loads a library entry as the current drawing', () => {
        const action = new LoadFromLibrary("Star");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addLibraryEntry({
            "id": "9",
            "name": "Star",
            "description": "Star",
            "code": "LINEPP Line1, $styles.default, Canvas@center, Canvas@top\nPOLY Polygon1, $styles.default, [ Line1@end ], 1\nDO spokes\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@(spokeRatio) ]\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@end ]\nENDDO",
            "aspectRatio": AspectRatio.ar1_1,
            "svgPreview": "Hello",
            "previewVBWidth": 123,
            "previewVBHeight": 456,
            "private": false,
            "lastUpdate": new Date(),
            "arguments": [
                {
                    "id": "12",
                    "name": "spokes",
                    "description": "How many spokes",
                    "default": 5,
                    "type": DataFieldType.Number,
                }
            ],
            "fields": [
                {
                    "id": "13",
                    "name": "spokeRatio",
                    "description": "How long are the spokes",
                    "default": 0.50,
                    "type": DataFieldType.Number,
                }
            ],
            "objects": [
                {
                    id: "12",
                    name: "Line1",
                    published: false,
                    isGuide: true
                }, {
                    id: "13",
                    name: "Polygon1",
                    published: true,
                    isGuide: false
                }
            ]
        })

        action.execute(null);

        expect(state.store.state.data.fields.length).to.equal(2);
        expect(state.store.state.data.fields[0].name).to.equal("spokes");
        expect(state.store.state.data.fields[0].value).to.equal(5);
        expect(state.store.state.data.fields[1].name).to.equal("spokeRatio");
        expect(state.store.state.data.fields[1].value).to.equal(0.5);

        expect(state.store.state.code.code.length).to.equal(8);

        expect(state.store.state.code.code).to.deep.equal([
            "LINEPP Line1, $styles.default, Canvas@center, Canvas@top",
            "POLY Polygon1, $styles.default, [ Line1@end ], 1",
            "DO spokes",
            "ROTATE Line1, 180 / spokes, Line1@start",
            "EXTPOLY Polygon1, [ Line1@(spokeRatio) ]",
            "ROTATE Line1, 180 / spokes, Line1@start",
            "EXTPOLY Polygon1, [ Line1@end ]", "ENDDO"
        ]);

        /*state.setCode(["LOAD r1, 10", "ADD r1, 20"])


        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 20",
            "ADD r1, 30"
        ])*/
    });

});