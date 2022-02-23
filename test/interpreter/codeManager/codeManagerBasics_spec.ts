import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";


describe('Code manager - Basics', () => {

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
        expect(Array.from(m.getStatementIndexesWithParticipation("r1")))
            .to.deep.equal([0, 1, 2, 3])
        expect(Array.from(m.getStatementIndexesWithParticipation("r2")))
            .to.deep.equal([2, 3])
        expect(Array.from(m.getStatementIndexesWithParticipation("r3")))
            .to.deep.equal([3])
        expect(Array.from(m.getStatementIndexesWithParticipation("does not exist")))
            .to.deep.equal([])
    });
});