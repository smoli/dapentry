import {describe, it} from "mocha";
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {expect} from "chai";
import {Persistence} from "../../src/state/Persistence";
import {GrCircle} from "../../src/geometry/GrCircle";
import {AspectRatio} from "../../src/geometry/AspectRatio";


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

    describe("working with the drawing", ()  => {
        it('can get a specific object', () => {
            const store = createAppStore();
            const state = new State(store, null);

            const c1 = new GrCircle("c1", 0, 0, 100);
            const c2 = new GrCircle("c2", 0, 0, 100);
            const c3 = new GrCircle("c3", 0, 0, 100);
            const c4 = new GrCircle("c4", 0, 0, 100);

            state.setObjectsOnDrawing([c1, c2, c3, c4]);

            // We cannot test for instance equality, because the vuex state
            // wraps everything into a proxy object
            expect(state.getObject("c1").instanceCount).to.equal(c1.instanceCount);
        });
    });
})
