import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../src/runtime/CodeManager";


describe('Code manager', () => {

    it('manages code lines', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 23",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ]);
    });

    it('can add a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.addStatement("ADD r3, r1, r2")
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 23",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ]);
    });

    it('can add multiple lines of code', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1           
        `;

        m.addCodeString(code);

        m.addStatements([
            "ADD r3, r1, r2",
            "INC r3",
            "INC r3"
        ]);

        expect(m.code.length).to.equal(6);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 23",
            "LOAD r2, r1",
            "ADD r3, r1, r2",
            "INC r3",
            "INC r3"
        ]);
    })

    it('can insert a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.insertStatement("ADD r3, r1, 10", 1);
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r3, r1, 10",
            "ADD r1, 23",
            "LOAD r2, r1",
        ]);
    });

    it("can insert multiple code lines", () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.insertStatements([
            "INC r1",
            "INC r1",
            "INC r1"
            ]
            , 1);

        expect(m.code.length).to.equal(6);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "INC r1",
            "INC r1",
            "INC r1",
            "ADD r1, 23",
            "LOAD r2, r1",
        ]);

    })

    it('can insert a code line after', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.insertStatementAfter("ADD r3, r1, 10", 1);
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 23",
            "ADD r3, r1, 10",
            "LOAD r2, r1",
        ]);
    })

    it('can remove a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 23",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ]);

        m.removeStatement(1);
        expect(m.code.length).to.equal(3);
        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ]);

    });

    it("can replace a code line", () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

        m.addCodeString(code);

        m.replaceStatement(1, "ADD r1, 1");

        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 1",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ])
    });

    it("can replace a code line with multiple statements", () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

        m.addCodeString(code);

        m.replaceStatement(1, "ADD r1, 1", "ADD r1, 2");

        expect(m.code).to.deep.equal([
            "LOAD r1, 23",
            "ADD r1, 1",
            "ADD r1, 2",
            "LOAD r2, r1",
            "ADD r3, r1, r2"
        ]);

    })

    it('can provide a list with all statement lines that use a register as an argument', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

        m.addCodeString(code);
        expect(m.getStatementIndexesWithParticipation("r1"))
            .to.deep.equal([0, 1, 2, 3])
        expect(m.getStatementIndexesWithParticipation("r2"))
            .to.deep.equal([2, 3])
        expect(m.getStatementIndexesWithParticipation("r3"))
            .to.deep.equal([3])
        expect(m.getStatementIndexesWithParticipation("does not exist"))
            .to.deep.equal([])
    });

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
            LOAD r1, 1
            ADD  r1, 1
            ADD  r2, r1, 1
            LOAD r3, 2
            ADD  r3, r2, 1
            LOAD r4, r3        
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r1");
            expect(m.code).to.deep.equal([
                "LOAD r3, 2",
                "LOAD r4, r3"
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

    describe('can determine which statement first initialized a register', () => {

        it('only recognizes the LOAD statement by default', () => {
            const m = new CodeManager();
            const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2           
        `;

            m.addCodeString(code);

            expect(m.getCreationStatement("r1")).to.equal(0);
            expect(m.getCreationStatement("r2")).to.equal(2);
            expect(m.getCreationStatement("r3")).to.equal(-1);
        });

        it('can be given a set of statements to consider as creation statements', () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
                    LOAD r1, 23
                    ADD r1, 23
                    LOAD r2, r1
                    ADD r3, r1, r2           
                `;

            m.addCodeString(code);

            expect(m.getCreationStatement("r1")).to.equal(0);
            expect(m.getCreationStatement("r2")).to.equal(2);
            expect(m.getCreationStatement("r3")).to.equal(3);
        });

    });

    describe("by analyzing the code", () => {

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
    });

    describe("by analyzing code annotations", () => {

        it("unannotated lines stay untouched", () => {
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

            expect(m.annotatedCode).to.deep.equal([
                { originalLine: 0, code: "LOAD r1, 20", level: 0 },
                { originalLine: 1, code: "LOAD r2, r1", level: 0 },
                { originalLine: 2, code: "LOAD lkjh, ( r1, 10 )", level: 0 },
                { originalLine: 3, code: "LOAD TESTtestTEST, [ r1, lkjh, 10, 10, 20, r1, 220, r2 ]", level: 0 },
                { originalLine: 4, code: "ADD r2, r2, r1", level: 0 },
                { originalLine: 5, code: "ITER iter, TESTtestTEST", level: 0 }
            ]);
        });

        it("can hide statements", () => {

            const code = `
                RECT Rectangle1-Prev, $styles.default, ( 360, 500 ), 218, f1iter.value
                APP Rectangle1.objects, Rectangle1-Prev                              @HIDE
                LOAD r1, 200
            `;

            const m = new CodeManager();
            m.addCodeString(code);

            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "RECT Rectangle1-Prev, $styles.default, ( 360, 500 ), 218, f1iter.value", level: 0 },
                { originalLine: 2, code: "LOAD r1, 200", level: 0 }
            ]);

        });
+
        it("is not confused by at-access", () => {
            const code = `CIRCLE Circle1, $styles.default, (224, 269), 74.43117626371358
                        CIRCLE Circle2, $styles.default, (319, 493), 94.64142856064674
                        MOVE Circle2@bottom, Circle1@top
            `;
            const m = new CodeManager();
            m.addCodeString(code);
            const annotated = m.annotatedCode;
            
            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "CIRCLE Circle1, $styles.default, ( 224, 269 ), 74.43117626371358", level: 0 },
                { originalLine: 1, code: "CIRCLE Circle2, $styles.default, ( 319, 493 ), 94.64142856064674", level: 0 },
                { originalLine: 2, code: "MOVE Circle2@bottom, Circle1@top", level: 0 }
            ])
            
            
        })

        it("can create blocks", () => {
            const code = `
                @EACH f1 @REPLACE Rectangle1-Tmp Rectangle1 @REPLACE f1iter.value f1
                    ITER f1iter, f1
                    OBLIST Rectangle1
                    RECT Rectangle1-Tmp, $styles.default, ( 408.5, 395.5 ), 219, f1iter.value            
                    APP Rectangle1.objects, Rectangle1-Tmp
                    LOAD Rectangle1-Prev, Rectangle1-Tmp
                    NEXT f1iter
                LOOPF1:
                @BODY    @REPLACE Rectangle1-Tmp Box1
                    RECT Rectangle1-Tmp, $styles.default, ( 408.5, 395.5 ), 219, f1iter.value
                    MOVE Rectangle1-Tmp, "bottom", Rectangle1-Prev, "top"                          @REPLACE Rectangle1-Prev Previous
                    LOAD r1, r2                                                                  @REPLACE r2 renault
                @ENDBODY
                    LOAD Rectangle1-Prev, Rectangle1-Tmp
                    APP Rectangle1.objects, Rectangle1-Tmp
                    NEXT f1iter
                    JINE f1iter, LOOPF1
                @ENDEACH
                    APP $drawing, Rectangle1                @HIDE
           `;

            const m = new CodeManager();
            m.addCodeString(code);

            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "@EACH f1", level: 0 },
                { originalLine: 9, code: "RECT Box1, $styles.default, ( 408.5, 395.5 ), 219, f1", level: 1 },
                { originalLine: 10, code: 'MOVE Box1, "bottom", Previous, "top"', level: 1 },
                { originalLine: 11, code: "LOAD r1, renault", level: 1 }
            ])

        });

        it("can create blocks from DO/ENDDO", () => {

            const code = `
                    LOAD r0, 0
                    DO 23
                    ADD r0, 1
                    MUL r0, 2
                    ENDDO
                    ADD r0, 12
            `;
            const m = new CodeManager();
            m.addCodeString(code);

            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "LOAD r0, 0", level: 0 },
                { originalLine: 1, code: "DO 23", level: 0 },
                { originalLine: 2, code: "ADD r0, 1", level: 1 },
                { originalLine: 3, code: "MUL r0, 2", level: 1 },
                { originalLine: 4, code: "ENDDO", level: 0 },
                { originalLine: 5, code: "ADD r0, 12", level: 0 },

            ])
        });

    });

});
