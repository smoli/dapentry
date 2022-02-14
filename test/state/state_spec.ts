import {describe, it} from "mocha";
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {AspectRatio} from "../../src/geometry/GrCanvas";
import {expect} from "chai";
import {Persistence} from "../../src/state/Persistence";


class MockPersistence extends Persistence {

    async load(state: State): Promise<void> {
        const code = await this.loadCode();
        state.setCode(code);
    }

    async loadCode(): Promise<Array<string>> {
        return ["LOAD r1, 10", "ADD r1, 20"]
    }
}

describe('State', () => {

    it("can put data in a store", () => {
        const store = createAppStore();
        const state = new State(store, null);

        expect(store.state.drawing.aspectRatio).to.not.equal(AspectRatio.ar16_10);
        state.setAspectRatio(AspectRatio.ar16_10);

        expect(store.state.drawing.aspectRatio).to.equal(AspectRatio.ar16_10);
    });

    it("will load code from a persistence object if provided", async () => {
        const store = createAppStore();
        const state = new State(store, null);

        const pers = new MockPersistence()

        await pers.load(state);

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10", "ADD r1, 20"
        ]);
    });


    describe("working with code", () => {

        it("stores code added", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, 10"]);
            expect(store.state.code.code).to.deep.equal([
                "LOAD r1, 10"
            ]);

            state.addCode(["ADD r1, 10"]);
            expect(state.store.state.code.code).to.deep.equal([
                "LOAD r1, 10", "ADD r1, 10"
            ]);
        })

        it("can replace statements", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, 10", "ADD r1, 20", "ADD r1, 30"]);
            state.replaceStatement(1, "ADD r1, 100", "ADD r1, 200");
            expect(state.store.state.code.code).to.deep.equal([
                "LOAD r1, 10",
                "ADD r1, 100",
                "ADD r1, 200",
                "ADD r1, 30"
            ]);

        });

        it("provides a combined code for data and logic", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, x"]);
            state.addDataField("x", 10);

            expect(state.fullCode).to.deep.equal([
                "LOAD x, 10", "LOAD r1, x"
            ]);
        })
    });

    describe("working with data fields", () => {
        it("you can add a data field", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            state.addDataField("f2", "Hello");
            state.addDataField("f3", [10, 20, 30]);

            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 10},
                {name: "f2", value: "Hello"},
                {name: "f3", value: [10, 20, 30]}
            ])
        });

        it("you can remove a data field", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            state.addDataField("f2", "Hello");
            state.addDataField("f3", [10, 20, 30]);

            state.removeDataField("f2");
            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 10},
                {name: "f3", value: [10, 20, 30]}
            ]);

            state.removeDataField("unknown");
            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 10},
                {name: "f3", value: [10, 20, 30]}
            ]);
        });

        it("it can provide a new, unused field name", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            state.addDataField("f2", "Hello");
            state.addDataField("f3", [10, 20, 30]);

            const newName = state.getNewDataFieldName("f");
            console.log("New field name would be", newName);
            expect(["f1", "f2", "f3"]).to.not.include(newName);
        });

        it("can get you a data field", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            expect(state.getDataField("f1")).to.deep.equal({name: "f1", value: 10});

        });

        it("you can change the value of a data field", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 10}
            ]);

            state.setDateFieldValue("f1", 20);
            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 20}
            ]);

            state.setDateFieldValue("unknown", 20)
            expect(state.store.state.data.fields).to.deep.equal([
                {name: "f1", value: 20}
            ]);
        });

        it("can tell how many code lines are generated for the data definitions", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);
            state.addDataField("f2", "Hello");
            state.addDataField("f3", [10, 20, 30]);

            expect(state.dataCodeLength).to.equal(3);

        });
    });

    describe("working with statements", () => {
        it("can set the selected statements by index", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, 10", "ADD r1, 20", "ADD r1, 30"]);
            state.setCodeSelection([2]);
            expect(state.codeSelection).to.deep.equal([2]);
            state.setCodeSelection([1, 3]);
            expect(state.codeSelection).to.deep.equal([1, 3]);
        });

        it("can add a statement to the selection", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, 10", "ADD r1, 20", "ADD r1, 30", "ADD r1, 30", "ADD r1, 30"]);
            state.setCodeSelection([2]);
            state.addToCodeSelection([4]);
            expect(state.codeSelection).to.deep.equal([2, 4]);
        });

        it("can clear the code selection", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addCode(["LOAD r1, 10", "ADD r1, 20", "ADD r1, 30", "ADD r1, 30", "ADD r1, 30"]);
            state.setCodeSelection([1, 2, 3]);
            expect(state.codeSelection).to.deep.equal([1, 2, 3]);
            state.clearCodeSelection();
            expect(state.codeSelection).to.deep.equal([]);
            state.addToCodeSelection([2, 3])
            expect(state.codeSelection).to.deep.equal([2, 3]);
        });
    });
})
