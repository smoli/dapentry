import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";


describe('Code Manager - Removing statements', () => {

    describe("removing all statements with a given register as an argument", () => {

        it("can be done", () => {
            const m = new CodeManager();
            const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2@d
            ADD r3, r1, r4@(r2)
            ADD ^r2, 12
            LOAD r4, 1        
            LOAD r5, [1, 2, 3, r2, 5]
            LOAD r6, (10, r2)
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r2");
            expect(m.code).to.deep.equal([
                "LOAD r1, 23",
                "ADD r1, 23",
                "LOAD r4, 1"
            ]);
        });

        it("will remove all statements for registers that where created by lines removed", () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
            LOAD r1, 10     #0
            LOAD r2, 20     #1
            ADD r2, r1      #2
            MUL r1, 2       #3
            LOAD r3, r1     #4
            LOAD r4, r3     #5
            LOAD r5, 60     #6
            LOAD r6, r1 + 2 #7
        `;

            m.addCodeString(code);

            m.removeStatement(0);
            expect(m.code).to.deep.equal([
                "LOAD r2, 20     #1",
                "LOAD r5, 60     #6"
            ]);
        });

        it("removing depending registers can be disabled", () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
            LOAD r1, 1
            ADD  r1, 1
            ADD  r2, r1, 1
            LOAD r3, 2
            ADD  r3, r2, 1
            LOAD r4, r3        
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r1", false);
            expect(m.code).to.deep.equal([
                "LOAD r3, 2",
                "ADD  r3, r2, 1",
                "LOAD r4, r3"
            ]);
        });
    });

    describe("removing all statements of a loop", () => {

        it("removes all statements of a loop if the do statement is removed", () => {

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

            m.removeStatement(3);

            expect(m.code).to.deep.equal([
                "LOAD r1, 10",
                "DO 5",
                "ADD r1, 10",
                "ADD r1, 2",
                "ENDDO",
                "MUL r1, 2"
            ])


        });

        it("removes all statements of a loop if the enddo statement is removed", () => {

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

            m.removeStatement(5);

            expect(m.code).to.deep.equal([
                "LOAD r1, 10",
                "DO 5",
                "ADD r1, 10",
                "ADD r1, 2",
                "ENDDO",
                "MUL r1, 2"
            ])
        });


        it("removes all statements of a for-each-loop if the endeach statement is removed", () => {

            const m = new CodeManager();

            const code = `
                LOAD r1, 10
                LOAD r2, [1, 2, 3, 4]
                FOREACH r2
                    ADD r1, 10
                    FOREACH r2
                        ADD r1, 1
                    ENDEACH
                    ADD r1, 2
                ENDEACH
                MUL r1, 2
            `;

            m.addCodeString(code);

            m.removeStatement(6);

            expect(m.code).to.deep.equal([
                "LOAD r1, 10",
                "LOAD r2, [1, 2, 3, 4]",
                "FOREACH r2",
                "ADD r1, 10",
                "ADD r1, 2",
                "ENDEACH",
                "MUL r1, 2"
            ])
        });


        // TODO: This is a known bug. It is right now not relevant for the designer as we check if a data
        //       field is used before deleting.
        xit("removes all statements of a for-each-loop if the register looped over is removed", () => {

            const m = new CodeManager();

            const code = `
                LOAD r1, 10
                LOAD r2, [1, 2, 3, 4]
                FOREACH r2
                    ADD r1, 10
                    FOREACH r2
                        ADD r1, 1
                    ENDEACH
                    ADD r1, 2
                ENDEACH
                MUL r1, 2
            `;

            m.addCodeString(code);

            m.removeStatement(1);

            expect(m.code).to.deep.equal([
                "LOAD r1, 10",
                "MUL r1, 2"
            ])
        });

    });

});