import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";


describe('Code Manager - Loop Analysis', () => {

    it("can tell if a statement is within a loop", () => {

        const code = `
                LOAD r2, 10
              LAB1:
                DEC r2
                JNZ r2, LAB2:
                LOAD r1,r2
              LAB2:
                JNZ r2, LAB1:       
            `;

        const m = new CodeManager();
        m.addCodeString(code);

        expect(m.isStatementInLoop(2)).to.be.true;
    });

    it("can tell if a statement is within a forEach on a specific list register", () => {
       const code = `
        ADD r1, 1
        FOREACH $c, c
            ADD r1, 4
            FOREACH $a, a
                ADD r1, 9
                FOREACH $b, b
                    ADD r1, 2
                ENDEACH
                ADD r1, a
            ENDEACH
        ENDEACH
        ADD r1, 3
        FOREACH $a, a
            DO 7
                ADD r1, 9
            ENDDO
        ENDEACH
       `;

       const m = new CodeManager();
       m.addCodeString(code);

       expect(m.isStatementInForEach(0, "a")).to.be.false;
       expect(m.isStatementInForEach(2, "a")).to.be.false;
       expect(m.isStatementInForEach(4, "a")).to.be.true;
       expect(m.isStatementInForEach(6, "a")).to.be.true;
       expect(m.isStatementInForEach(8, "a")).to.be.true;
       expect(m.isStatementInForEach(11, "a")).to.be.false;
       expect(m.isStatementInForEach(13, "a")).to.be.true;
       expect(m.isStatementInForEach(14, "a")).to.be.true;
       expect(m.isStatementInForEach(15, "a")).to.be.true;
    });

    it("can create new unused register names", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 20
                LOAD r2, r1
                LOAD lkjh, ( r1, 10 )
                LOAD TESTtestTEST, [ r1, lkjh, 10, 10, 20, r1, 220, r2 ]
                ADD r2, r2, r1
                ITER iter, TESTtestTEST
            `;

        m.addCodeString(code);
        const registers = ["r1", "r2", "lkjh", "TESTtestTEST", "iter"];

        for (const r of registers) {
            expect(m.registerExists(r)).to.be.true;
        }

        expect(m.makeUniqueRegisterName("newRegister")).to.equal("newRegister");
        for (let i = 0; i < 10; i++) {
            for (const r of registers) {
                expect(registers).not.includes(m.makeUniqueRegisterName(r));
            }
        }
    });

    it("can find a matching enddo for a do statement", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 10
                DO 5
                    ADD r1, 10
                    DO 4
                        ADD r1, 1
                    ENDDO
                    ADD r1, 2
                ENDDO
                MUL r1, 2
            `;

        m.addCodeString(code);

        expect(m.findMatchingEndDo(1)).to.equal(7);
    });

    it("can find a matching do for a enddo statement", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 10
                DO 5
                    ADD r1, 10
                    DO 4
                        ADD r1, 1
                    ENDDO
                    ADD r1, 2
                ENDDO
                MUL r1, 2
            `;

        m.addCodeString(code);

        expect(m.findMatchingDo(7)).to.equal(1);
    });


    it("can find a matching endeach for a foreach statement", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 10
                LOAD r2, [1, 2, 3]
                LOAD r3, [1, 2, 3]
                FOREACH r2
                    ADD r1, 10
                    DO 4
                        FOREACH r3
                            ADD r1, 1
                        ENDEACH
                    ENDDO
                    ADD r1, 2
                ENDEACH
                MUL r1, 2
            `;

        m.addCodeString(code);

        expect(m.findMatchingEndEach(3)).to.equal(11);
    })

    it("can find a matching foreach for an endeach statement", () => {
        const m = new CodeManager();

        const code = `
                LOAD r1, 10
                LOAD r2, [1, 2, 3]
                LOAD r3, [1, 2, 3]
                FOREACH r2
                    ADD r1, 10
                    DO 4
                        FOREACH r3
                            ADD r1, 1
                        ENDEACH
                    ENDDO
                    ADD r1, 2
                ENDEACH
                MUL r1, 2
            `;

        m.addCodeString(code);

        expect(m.findMatchingForEach(11)).to.equal(3);
    })

});