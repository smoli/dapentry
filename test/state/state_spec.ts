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

    it("will load data from a persistence object if provided", async () => {
        const store = createAppStore();
        const state = new State(store, null);

        const pers = new MockPersistence()

        await pers.load(state);

        expect(store.state.code.code).to.deep.equal([
            "LOAD r1, 10", "ADD r1, 20"
        ]);
    });

})