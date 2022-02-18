import {describe, it} from "mocha";
import {expect} from "chai"
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {MockController} from "../testHelpers/mock_controller";
import {RenameDataField} from "../../src/actions/RenameDataField";
import App from "../../ui5stuff/controller/App.controller";
import {AppConfig} from "../../src/core/AppConfig";

describe('Rename data field', () => {

    it('renames the data field in all usages of the code', () => {
        const action = new RenameDataField("r1", "r2");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("r1", 10);

        const code = `
            LOAD r1, 10
            DO 2
            ADD r1, 2
            ENDDO`;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r2, 10",
            "DO 2",
            "ADD r2, 2",
            "ENDDO"
        ]);
        expect(state.getDataField("r1")).to.not.be.ok;
        expect(state.getDataField("r2")).to.deep.equal({ name: "r2", value: 10 });

    });

    it("will not rename if the new name already exists in the code", () => {
        const action = new RenameDataField("r1", "r2");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("r1", 10);

        const code = `
            LOAD r1, 10
            LOAD r2, 20
            DO 2
            ADD r1, 2
            ENDDO`;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "LOAD r2, 20",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);
        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });

    });

    it('will not rename if there is another data field of the same name', () => {
        const action = new RenameDataField("r1", "r2");
        const state = new State(createAppStore(), null);
        action.controller = new MockController(state);

        state.addDataField("r1", 10);
        state.addDataField("r2", 20);

        const code = `
            LOAD r1, 10
            DO 2
            ADD r1, 2
            ENDDO`;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);

        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });
        expect(state.getDataField("r2")).to.deep.equal({ name: "r2", value: 20 });
    });

    it("will not rename if the name is invalid", () => {
        let action = new RenameDataField("r1", "1newThing");
        const state = new State(createAppStore(), null);
        const controller = new MockController(state);
        action.controller = controller;

        state.addDataField("r1", 10);

        const code = `
            LOAD r1, 10
            DO 2
            ADD r1, 2
            ENDDO`;

        state.setCodeString(code);

        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);

        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });

        action = new RenameDataField("r1", "$lsadkjfh");
        action.controller = controller;
        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);

        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });


        action = new RenameDataField("r1", AppConfig.Runtime.styleRegisterName);
        action.controller = controller;
        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);

        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });

        action = new RenameDataField("r1", AppConfig.Runtime.canvasObjectName);
        action.controller = controller;
        action.execute(null);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "DO 2",
            "ADD r1, 2",
            "ENDDO"
        ]);

        expect(state.getDataField("r1")).to.deep.equal({ name: "r1", value: 10 });
    })


});