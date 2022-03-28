import {describe, it} from "mocha";
import {expect} from "chai"
import {AddStatement} from "../../src/actions/AddStatement";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {SetFillOpacity} from "../../src/actions/SetFillOpacity";
import {GrCircle} from "../../src/geometry/GrCircle";

describe('Style actions', () => {

    it('Fill Opacity creates a new statement', async () => {
        const c1 = new GrCircle("Circle1", 100, 100, 300)
        const action = new SetFillOpacity([c1], 0.5);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300"
        ]);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            'OPACITY Circle1, 0.5'
        ])
    });

    it('it merges with the last if added to the end', async () => {
        const c1 = new GrCircle("Circle1", 100, 100, 300)
        const action = new SetFillOpacity([c1], 0.5);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            'OPACITY Circle1, 0.2'
        ]);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            'OPACITY Circle1, 0.5'
        ])
    });

    it('it merges with the last selected', async () => {
        const c1 = new GrCircle("Circle2", 100, 100, 300)
        const action = new SetFillOpacity([c1], 0.5);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            "CIRCLECR Circle2,$styles.default,(100, 100), 300",
            'OPACITY Circle2, 0.2',
            "CIRCLECR Circle3,$styles.default,(100, 100), 300",
            "CIRCLECR Circle4,$styles.default,(100, 100), 300"
        ]);

        state.setCodeSelection([0, 1, 2]);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            "CIRCLECR Circle2,$styles.default,(100, 100), 300",
            'OPACITY Circle2, 0.5',
            "CIRCLECR Circle3,$styles.default,(100, 100), 300",
            "CIRCLECR Circle4,$styles.default,(100, 100), 300"
        ])
    });

    it('mergin also works with the next line after the selection', async () => {
        const c1 = new GrCircle("Circle2", 100, 100, 300)
        const action = new SetFillOpacity([c1], 0.5);
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.setCode([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            "CIRCLECR Circle2,$styles.default,(100, 100), 300",
            'OPACITY Circle2, 0.2',
            "CIRCLECR Circle3,$styles.default,(100, 100), 300",
            "CIRCLECR Circle4,$styles.default,(100, 100), 300"
        ]);

        state.setCodeSelection([0, 1]);

        await action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(100, 100), 300",
            "CIRCLECR Circle2,$styles.default,(100, 100), 300",
            'OPACITY Circle2, 0.5',
            "CIRCLECR Circle3,$styles.default,(100, 100), 300",
            "CIRCLECR Circle4,$styles.default,(100, 100), 300"
        ])
    });

});