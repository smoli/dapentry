import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../src/runtime/CodeManager";
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";
import {Parser, TokenTypes} from "../../src/runtime/interpreter/Parser";


describe('Code manager', () => {

    it('manages code lines', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1
            ADD r3 r1 r2           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "ADD r1 23",
            "LOAD r2 r1",
            "ADD r3 r1 r2"
        ]);
    });

    it('can add a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.addStatement("ADD r3 r1 r2")
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "ADD r1 23",
            "LOAD r2 r1",
            "ADD r3 r1 r2"
        ]);
    });

    it('can insert a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.insertStatement("ADD r3 r1 10", 1);
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "ADD r3 r1 10",
            "ADD r1 23",
            "LOAD r2 r1",
        ]);
    });

    it('can insert a code line after', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(3);

        m.insertStatementAfter("ADD r3 r1 10", 1);
        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "ADD r1 23",
            "ADD r3 r1 10",
            "LOAD r2 r1",
        ]);
    })

    it('can remove a code line', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1
            ADD r3 r1 r2           
        `;

        m.addCodeString(code);

        expect(m.code.length).to.equal(4);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "ADD r1 23",
            "LOAD r2 r1",
            "ADD r3 r1 r2"
        ]);

        m.removeStatement(1);
        expect(m.code.length).to.equal(3);
        expect(m.code).to.deep.equal([
            "LOAD r1 23",
            "LOAD r2 r1",
            "ADD r3 r1 r2"
        ]);

    });

    it('can provide a list with all statement lines that use a register as an argument', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1
            ADD r3 r1 r2           
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

    describe("removing all statments with a given register as an argument", () => {


        it("can be done", () => {
            const m = new CodeManager();
            const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1
            ADD r3 r1 r2
            LOAD r4 1        
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r2");
            expect(m.code).to.deep.equal([
                "LOAD r1 23",
                "ADD r1 23",
                "LOAD r4 1"
            ]);
        });

        it("will remove all statements for registers that where created by lines removed", () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
            LOAD r1 1
            ADD  r1 1
            ADD  r2 r1 1
            LOAD r3 2
            ADD  r3 r2 1
            LOAD r4 r3        
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r1");
            expect(m.code).to.deep.equal([
                "LOAD r3 2",
                "LOAD r4 r3"
            ]);
        });

        it("removing depending registers can be disabled", () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
            LOAD r1 1
            ADD  r1 1
            ADD  r2 r1 1
            LOAD r3 2
            ADD  r3 r2 1
            LOAD r4 r3        
        `;

            m.addCodeString(code);

            m.removeStatementsForRegister("r1", false);
            expect(m.code).to.deep.equal([
                "LOAD r3 2",
                "ADD  r3 r2 1",
                "LOAD r4 r3"
            ]);
        });
    });

    describe('can determine which statement first initialized a register', () => {

        it('only recognizes the LOAD statement by default', () => {
            const m = new CodeManager();
            const code = `
            LOAD r1 23
            ADD r1 23
            LOAD r2 r1
            ADD r3 r1 r2           
        `;

            m.addCodeString(code);

            expect(m.getCreationStatement("r1")).to.equal(0);
            expect(m.getCreationStatement("r2")).to.equal(2);
            expect(m.getCreationStatement("r3")).to.equal(-1);
        });

        it('can be given a set of statements to consider as creation statements', () => {
            const m = new CodeManager({LOAD: 1, ADD: 1});
            const code = `
                    LOAD r1 23
                    ADD r1 23
                    LOAD r2 r1
                    ADD r3 r1 r2           
                `;

            m.addCodeString(code);

            expect(m.getCreationStatement("r1")).to.equal(0);
            expect(m.getCreationStatement("r2")).to.equal(2);
            expect(m.getCreationStatement("r3")).to.equal(3);
        });

    });

    describe("by analyzing the code", () => {
        it("can create new unused register names", () => {
            const m = new CodeManager();

            const code = `
                LOAD r1 20
                LOAD r2 r1
                LOAD lkjh ( r1 10 )
                LOAD TESTtestTEST [ r1 lkjh 10 10 20 r1 220 r2 ]
                ADD r2 r2 r1
                ITER iter TESTtestTEST
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
                LOAD r1 20
               LABEL:
               LOOP:
                LOAD r2 r1
               HOTCHOCOLATE:
                LOAD lkjh ( r1 10 )
               WELCOMETOTHEJUNGLE:
                LOAD TESTtestTEST [ r1 lkjh 10 10 20 r1 220 r2 ]
               L:
                ADD r2 r2 r1
                ITER iter TESTtestTEST
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
                LOAD r1 20
                LOAD r2 r1
                LOAD lkjh ( r1 10 )
                LOAD TESTtestTEST [ r1 lkjh 10 10 20 r1 220 r2 ]
                ADD r2 r2 r1
                ITER iter TESTtestTEST
            `;

            m.addCodeString(code);

            expect(m.annotatedCode).to.deep.equal([
                { originalLine: 0, code: "LOAD r1 20" },
                { originalLine: 1, code: "LOAD r2 r1" },
                { originalLine: 2, code: "LOAD lkjh ( r1 10 )" },
                { originalLine: 3, code: "LOAD TESTtestTEST [ r1 lkjh 10 10 20 r1 220 r2 ]" },
                { originalLine: 4, code: "ADD r2 r2 r1" },
                { originalLine: 5, code: "ITER iter TESTtestTEST" }
            ]);
        });

        it("can hide statements", () => {

            const code = `
                RECT Rectangle1-Prev $styles.default ( 360 500 ) 218 f1iter.value
                APP Rectangle1.objects Rectangle1-Prev                              @HIDE
                LOAD r1 200
            `;

            const m = new CodeManager();
            m.addCodeString(code);

            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "RECT Rectangle1-Prev $styles.default ( 360 500 ) 218 f1iter.value" },
                { originalLine: 2, code: "LOAD r1 200" }
            ]);

        });

        it("can create blocks", () => {
            const code = `
                @EACH f1 @REPLACE Rectangle1-Tmp Rectangle1 @REPLACE f1iter.value f1
                    ITER f1iter f1
                    OBLIST Rectangle1
                    RECT Rectangle1-Tmp $styles.default ( 408.5 395.5 ) 219 f1iter.value            
                    APP Rectangle1.objects Rectangle1-Tmp
                    LOAD Rectangle1-Prev Rectangle1-Tmp
                    NEXT f1iter
                LOOPF1:
                @BODY    @REPLACE Rectangle1-Tmp Box1
                    RECT Rectangle1-Tmp $styles.default ( 408.5 395.5 ) 219 f1iter.value
                    MOVE Rectangle1-Tmp "bottom" Rectangle1-Prev "top"                          @REPLACE Rectangle1-Prev Previous
                    LOAD r1 r2                                                                  @REPLACE r2 renault
                @ENDBODY
                    LOAD Rectangle1-Prev Rectangle1-Tmp
                    APP Rectangle1.objects Rectangle1-Tmp
                    NEXT f1iter
                    JINE f1iter LOOPF1
                @ENDEACH
                    APP $drawing Rectangle1                @HIDE
           `;

            const m = new CodeManager();
            m.addCodeString(code);

            const annotated = m.annotatedCode;

            expect(annotated).to.deep.equal([
                { originalLine: 0, code: "@EACH f1" },
                { originalLine: 9, code: "RECT Box1 $styles.default ( 408.5 395.5 ) 219 f1" },
                { originalLine: 10, code: 'MOVE Box1 "bottom" Previous "top"' },
                { originalLine: 11, code: "LOAD r1 renault" },
                { originalLine: 17, code: "@ENDEACH" }
            ])

        })
    });


    it("can be used to replace a statement with a complex block of statements", async () => {
        const m = new CodeManager({LOAD: 1, ADD: 1});
        const code = `
                LOAD globalResult [ ]
                LOAD data [ 1 2 3 4 ]
                LOAD r1 1
                ADD r2 r1 10
                APP globalResult r2
                LOAD r3 2
        `;

        const target = `
                LOAD data [ 1 2 3 4 ]
                LOAD r1 1
                
                ITER dataIt data
                LOAD r2 [ ]
              LOOP:
                ADD tmp r1 dataIt.value  # CIRCLE...
                APP r2 tmp
                NEXT dataIt
                JINE dataIt LOOP                
        `


        m.addCodeString(code);

        function replace(reg: string, argumentToReplace: number, dataName: string) {
            let index: number = m.getCreationStatement(reg);
            const original = m.code[index];
            const tokens = Parser.parseLine(original);

            const tempRegName = m.makeUniqueRegisterName(reg + "Looped");
            const iteratorName = m.makeUniqueRegisterName(dataName + "iter");

            for (const t of tokens) {
                if (t.type === TokenTypes.REGISTER && t.value === reg) {
                    t.value = tempRegName;
                }
            }

            tokens[argumentToReplace + 1].value = iteratorName + ".value";
            const newCodeLine = Parser.constructCodeLine(tokens);

            m.removeStatement(index);

            m.insertStatement(`ITER ${iteratorName} data`, index++);
            m.insertStatement(`LOAD ${reg} [ ]`, index++);

            m.insertStatement("PUSHSF", index++);
            const labelName = m.makeUniqueLabelName("LOOP" + dataName.toUpperCase());
            m.insertStatement(`${labelName}:`, index++);
            m.insertStatement(newCodeLine, index++);
            m.insertStatement(`APP ${reg} ${tempRegName}`, index++);
            m.insertStatement(`NEXT ${iteratorName}`, index++);
            m.insertStatement(`JINE ${iteratorName} ${labelName}`, index++);
            m.insertStatement("POPSF", index++);
        }

        replace("r2", 2, "data");

        const i = new Interpreter();
        i.parse(m.code);
        await i.run();

        console.log(m.code.join("\n"));

        expect(i.getRegister("r2")).to.deep.equal([2, 3, 4, 5]);
        expect(i.getRegister("globalResult")).to.deep.equal([[2, 3, 4, 5]]);

    });
});