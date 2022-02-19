import {describe, it} from "mocha";
import {expect} from "chai"
import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";
import {AppState} from "../../ui5stuff/model/AppState";
import {createAppStore} from "../../src/state/AppStore";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";


describe('App controller', () => {

    it('runs the program when a new statement is added', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1
            ADD r1, 1
            ADD r1, 1        
        `;

        state.setCodeString(code);
        await controller.addStatement("ADD r1, 1");
        expect(inter.getRegister("r1")).to.equal(14);
    });

    it("will run the program up to the selected statement", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1
            ADD r1, 1
            ADD r1, 1        
        `;

        state.setCodeString(code);
        await controller.selectStatement(0);

        expect(inter.getRegister("r1")).to.equal(10);

        await controller.selectStatement(2);
        expect(inter.getRegister("r1")).to.equal(12);

        await controller.selectStatement(20);
        expect(inter.getRegister("r1")).to.equal(13);
    });

    it('can step through the program statement by statement when a statement is selected', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1
            ADD r1, 1
            ADD r1, 1        
        `;

        state.setCodeString(code);

        await controller.selectStatement(0);
        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(11);
    });

    it('will not step when there is no statement selection', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1
            ADD r1, 1
            ADD r1, 1        
        `;

        state.setCodeString(code);

        await controller.nextStep();
        // Program is not run yet.
        expect(inter.getRegister("r1")).to.be.undefined
    });

    it('will update the selection when performing a step', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1
            ADD r1, 1
            ADD r1, 1        
        `;

        state.setCodeString(code);

        await controller.selectStatement(0);
        await controller.nextStep();

        expect(state.codeSelection).to.deep.equal([1]);
    });

    it('will execute but not halt on hidden statements', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1 @HIDE
            ADD r1, 1 
            ADD r1, 1        
        `;

        state.setCodeString(code);

        await controller.selectStatement(0);
        await controller.nextStep();

        expect(inter.getRegister("r1")).to.equal(12);
        expect(state.codeSelection).to.deep.equal([2]);
    });

    it("will take the code for data fields into account when stepping", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1 @HIDE
            ADD r1, 1 
            ADD r1, 1        
        `;

        state.addDataField("f1", 10)
        state.addDataField("f2", 20)
        state.setCodeString(code);

        await controller.selectStatement(0);
        await controller.nextStep();

        expect(inter.pc).to.equal(4)
        expect(inter.getRegister("r1")).to.equal(12);
        expect(state.codeSelection).to.deep.equal([2]);
    });

    it('will iterate through loops', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            DO 5
                ADD r1, 1 
            ENDDO 
            ADD r1, 1000        
        `;

        state.setCodeString(code);

        await controller.selectStatement(0);

        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(10);

        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(11);

        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(11);

        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(12);

    });

    it("will stop stepping if the end of the program is reached", async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, 10
            ADD r1, 1 @HIDE
            ADD r1, 1 
            ADD r1, 1        
        `;

        state.addDataField("f1", 10)
        state.addDataField("f2", 20)
        state.setCodeString(code);

        await controller.selectStatement(0);
        await controller.nextStep();
        await controller.nextStep();
        await controller.nextStep();
        await controller.nextStep();
        await controller.nextStep();
        await controller.nextStep();
        expect(inter.getRegister("r1")).to.equal(13);
        expect(state.codeSelection).to.deep.equal([3]);
    })
});