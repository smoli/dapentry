import {describe, it} from "mocha";
import {createAppStore} from "../src/state/AppStore";
import {State} from "../src/state/State";
import {AspectRatio} from "../src/geometry/GrCanvas";
import {expect} from "chai";
import {Persistence} from "../src/state/Persistence";



class MockPersistence extends Persistence {
    async loadCode(): Promise<Array<string>> {
        return ["LOAD r1, 10", "ADD r1, 20"]
    }
}

describe('State', () => {

    it("can put data in a store", () => {
        const store = createAppStore();
        const state = new State(store);

        expect(store.state.drawing.aspectRatio).to.not.equal(AspectRatio.ar16_10);
        state.setAspectRatio(AspectRatio.ar16_10);

        expect(store.state.drawing.aspectRatio).to.equal(AspectRatio.ar16_10);
    });

    it("will load data from a persistence object if provided", async () => {
        const store = createAppStore();
        const state = new State(store);
        await state.load(new MockPersistence());

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10", "ADD r1, 20"
        ]);
    });

})