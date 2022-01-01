import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../src/runtime/CodeManager";


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
});