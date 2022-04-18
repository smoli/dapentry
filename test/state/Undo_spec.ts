import {describe, it} from "mocha";
import {expect} from "chai"
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {AspectRatio} from "../../src/geometry/AspectRatio";
import {DataFieldType} from "../../src/state/modules/Data";


describe('Undo', () => {

    it('revert changes to the state', () => {
            const store = createAppStore();
            const state = new State(store, null);

            expect(store.state.drawing.aspectRatio).to.not.equal(AspectRatio.ar16_10);
            state.setAspectRatio(AspectRatio.ar16_10);

            expect(store.state.drawing.aspectRatio).to.equal(AspectRatio.ar16_10);

            state.undo();

            expect(store.state.drawing.aspectRatio).to.not.equal(AspectRatio.ar16_10);
    });

    it('reverts code changes', () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addCode(["LOAD r1, 10", "ADD r1, 10"]);

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 10"
            ]);

        state.addCode(["SUB r1, 5"]);

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 10",
            "SUB r1, 5"
            ]);

        state.undo();

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 10"
        ]);

        state.insertStatements(1, "SUB r1, 5");

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "SUB r1, 5",
            "ADD r1, 10"
        ]);

        state.undo();

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 10"
        ]);
    });

    it("reverts data field changes", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f2", "Hello");
        state.addDataField("f3", [10, 20, 30]);

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: "Hello", type: DataFieldType.String,
                description: null,
                published: true
            },
            {
                name: "f3", value: [10, 20, 30], type: DataFieldType.List,
                description: null,
                published: true
            }
        ]);

        state.undo();

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: "Hello", type: DataFieldType.String,
                description: null,
                published: true
            }
        ]);

        state.renameDataField("f1", "f10");

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f10", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: "Hello", type: DataFieldType.String,
                description: null,
                published: true
            }
        ]);

        state.undo();

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: "Hello", type: DataFieldType.String,
                description: null,
                published: true
            }
        ]);
    });

});
