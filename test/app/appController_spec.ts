import {describe, it} from "mocha";
import {expect} from "chai"
import {AppController} from "../../src/core/AppController";
import {State} from "../../src/state/State";
import {createAppStore} from "../../src/state/AppStore";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {T_ARRAY, T_NUMBER, T_OPCODE, T_POINT, T_REGISTER} from "../testHelpers/tokens";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {ObjectType} from "../../src/geometry/GrObject";
import exp = require("constants");


describe('App controller', () => {

    it('can update statements', async () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
            LOAD r1, [1, 2, 3, (1, 2), 2, 4 ]
        `;

        state.setCodeString(code);

        await controller.updateStatement(0, [2, 2], "10");
        expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal(
            [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_ARRAY(
                    T_NUMBER(1),
                    T_NUMBER(2),
                    T_NUMBER(10),
                    T_POINT(T_NUMBER(1), T_NUMBER(2)),
                    T_NUMBER(2),
                    T_NUMBER(4)
                )
            ]
        )

        await controller.updateStatement(0, [2, 3, 0], "7");
        expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal(
            [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_ARRAY(
                    T_NUMBER(1),
                    T_NUMBER(2),
                    T_NUMBER(10),
                    T_POINT(T_NUMBER(7), T_NUMBER(2)),
                    T_NUMBER(2),
                    T_NUMBER(4)
                )
            ]
        );

        await controller.updateStatement(0, [1], "r5");
        expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal(
            [
                T_OPCODE("LOAD"),
                T_REGISTER("r5"),
                T_ARRAY(
                    T_NUMBER(1),
                    T_NUMBER(2),
                    T_NUMBER(10),
                    T_POINT(T_NUMBER(7), T_NUMBER(2)),
                    T_NUMBER(2),
                    T_NUMBER(4)
                )
            ]
        );
    });


    describe("handles the selection status of objects", () => {

        it('updates the selection with the new object instances when the code is run', async () => {
                const state = new State(createAppStore(), null);
                const inter = new GfxInterpreter();
                const controller = new AppController(state, inter);

                state.addDataField("f1", 100);

                const code = `
                    CIRCLECR Circle1,$styles.default,(355.48, 221.11),f1
                    CIRCLECR Circle2,$styles.default,(478.19, 440.50),f1
                `;

                await controller.setCode(code);

                const objs1 = state.objects.filter(o => o.type !== ObjectType.Canvas);
                expect(objs1.length).to.equal(2);

                await controller.handleObjectSelection(objs1[0]);
                expect(state.selection.length).to.equal(1);

                await controller.setDataFieldValue("f1", 200);
                const objs2 = state.objects.filter(o => o.type !== ObjectType.Canvas);
                expect(objs2.length).to.equal(2);

                expect(state.selection.length).to.equal(1);
                expect(state.selection[0]).to.equal(objs2[0]);
                expect(objs1[0].uniqueName).to.equal(objs2[0].uniqueName);
                expect(objs1[0]).to.not.equal(objs2[0]);
        });
    })

    describe('program stepping functionality', () => {

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

    it("can clear everything to start anew", async () => {

        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        const code = `
        CIRCLECR Circle1,$styles.default,(347.43, 295.68),113.45
        CIRCLECR Circle2,$styles.default,(603.86, 340.09),183.95
        CIRCLECR Circle3,$styles.default,(285.83, 636.63),259.96
        CIRCLECR Circle4,$styles.default,(725.63, 682.47),120.58
        CIRCLECR Circle5,$styles.default,(887.50, 242.68),174.92
        CIRCLECR Circle6,$styles.default,(419.06, 161.02),109.57
        CIRCLECR Circle7,$styles.default,(126.82, 178.21),184.46
        CIRCLECR Circle8,$styles.default,(631.08, 888.76),96.95
        RECTPP Rectangle1,$styles.default,Circle3@center,Circle2@center`

        await controller.setCode(code);

        let objs = state.store.state.drawing.objects.filter(o => o.type !== ObjectType.Canvas);
        expect(objs.length).to.equal(9);

        const name = objs[3].uniqueName;

        await controller.handleObjectSelection(objs[3]);
        expect(state.store.state.drawing.selection.length).to.equal(1);

        await controller.makeSelectedObjectsGuides();
        expect(objs[3].isGuide).to.be.true;

        await controller.clearAll();
        objs = state.store.state.drawing.objects.filter(o => o.type !== ObjectType.Canvas);
        expect(objs.length).to.equal(0);
        expect(state.store.state.code.code.length).to.equal(0);

        await controller.setCode(code);
        objs = state.store.state.drawing.objects.filter(o => o.type !== ObjectType.Canvas);
        expect(objs.length).to.equal(9);
        expect(objs.find(o => o.uniqueName === name).isGuide).to.be.false;

    })
});
