import {describe, it} from "mocha";
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {AspectRatio} from "../../src/geometry/GrCanvas";
import {expect} from "chai";
import {Persistence} from "../../src/state/Persistence";


describe('Code state', () => {

    it("can set the whole code", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.setCode(["LOAD r1, 2", "ADD r1, 10", "ADD r1, 10"]);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 2",
            "ADD r1, 10",
            "ADD r1, 10"
        ]);

        state.setCode(["LOAD r2, 20", "ADD r2, 1", "ADD r2, 1"]);

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r2, 20",
            "ADD r2, 1",
            "ADD r2, 1"
        ]);

    })

    it("can add a statement", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addCode(["LOAD r1, 2"]);

        expect(state.store.state.code.code).to.deep.equal(["LOAD r1, 2"]);
    });

    it("can add multiple statements", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addCode(["LOAD r1, 2"]);

        expect(state.store.state.code.code).to.deep.equal(["LOAD r1, 2"]);
    })

    it("can replace a statement", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.setCode(["LOAD r1, 2", "ADD r1, 10", "ADD r1, 10"]);
        state.replaceStatement(1, "ADD r1, 20");

        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 2",
            "ADD r1, 20",
            "ADD r1, 10"
        ]);

    })

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
    });

    it("can take a string of code", () => {
        const store = createAppStore();
        const state = new State(store, null);

        const code = `
                LOAD r1, 10
                ADD r1, 20
                ADD r1, 30
            `;

        state.setCodeString(code);
        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 20",
            "ADD r1, 30"
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

    it("can insert lines of code", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addCode(["LOAD r1, 10", "ADD r1, 20", "ADD r1, 30"]);
        state.insertStatements(1, "ADD r1, 100", "ADD r1, 200");
        expect(state.store.state.code.code).to.deep.equal([
            "LOAD r1, 10",
            "ADD r1, 100",
            "ADD r1, 200",
            "ADD r1, 20",
            "ADD r1, 30"
        ]);
    })


})