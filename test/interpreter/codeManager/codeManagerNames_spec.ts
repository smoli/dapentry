import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";
import {Parser} from "../../../src/runtime/interpreter/Parser";
import {T_ARRAY, T_EXPRESSION, T_NUMBER, T_OPCODE, T_POINT, T_REGISTER, T_REGISTERAT} from "../../testHelpers/tokens";


describe('Code Manager - Names', () => {

    it("can create new unused label names", () => {
        const m = new CodeManager();

        const code = `
               L1:
                LOAD r1, 20
               LABEL:
               LOOP:
                LOAD r2, r1
               HOTCHOCOLATE:
                LOAD lkjh, ( r1, 10 )
               WELCOMETOTHEJUNGLE:
                LOAD TESTtestTEST, [ r1, lkjh, 10, 10, 20, r1, 220, r2 ]
               L:
                ADD r2, r2, r1
                ITER iter, TESTtestTEST
            `;

        m.addCodeString(code);
        const labels = ["L1", "LABEL", "LOOP", "HOTCHOCOLATE", "WELCOMETOTHEJUNGLE", "L"];

        for (const l of labels) {
            expect(m.labelExists(l)).to.be.true;
        }

        expect(m.makeUniqueLabelName("NEWLABEL")).to.equal("NEWLABEL");
        for (let i = 0; i < 10; i++) {
            for (const l of labels) {
                expect(labels).not.includes(m.makeUniqueLabelName(l));
            }
        }
    });

    it('can rename a register throughout the whole code', () => {
        const code = `
                LOAD r1, 100
                LOAD r2, [10, 20, r1, 10]
                LOAD r3, r2@1
                LOAD r4, (r1, r2@2)
                LOAD r5, r1 + 2 * r2@(r1)
            `

        const m = new CodeManager();
        m.addCodeString(code);

        m.renameRegister("r1", "r10");

        expect(m.code.map(l => Parser.parseLine(l))).to.deep.equal([
            [T_OPCODE("LOAD"), T_REGISTER("r10"), T_NUMBER(100)],
            [T_OPCODE("LOAD"), T_REGISTER("r2"), T_ARRAY(T_NUMBER(10), T_NUMBER(20), T_REGISTER("r10"), T_NUMBER(10))],
            [T_OPCODE("LOAD"), T_REGISTER("r3"), T_REGISTERAT("r2", 1)],
            [T_OPCODE("LOAD"), T_REGISTER("r4"), T_POINT(T_REGISTER("r10"), T_REGISTERAT("r2", 2))],
            [T_OPCODE("LOAD"), T_REGISTER("r5"), T_EXPRESSION(T_REGISTER("r10"), "+", T_EXPRESSION(T_NUMBER(2), "*", T_REGISTERAT("r2", T_REGISTER("r10"))))]
        ])

        expect(m.registerExists("r1")).to.be.false;
        expect(m.registerExists("r10")).to.be.true;

    });
});