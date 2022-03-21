import {describe, it} from "mocha";
import {expect} from "chai"
import {CodeManager} from "../../../src/runtime/CodeManager";
import {Parser} from "../../../src/runtime/interpreter/Parser";
import {T_ARRAY, T_ARRAY_N, T_NONLOCAL_REGISTER, T_OPCODE, T_REGISTER, T_TABLE} from "../../testHelpers/tokens";


describe('Code Manager - Registers', () => {

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

    it('can provide a list with all statement lines that use a register as an argument', () => {
        const m = new CodeManager();
        const code = `
            LOAD r1, 23
            ADD r1, 23
            LOAD r2, r1
            ADD r3, r1, r2
            LOAD r4, [[1, 2], [2, 3]](x, y)
            LOAD r5, r4.x  
        `;

        m.addCodeString(code);
        expect(Array.from(m.getStatementIndexesWithParticipation("r1")))
            .to.deep.equal([0, 1, 2, 3])
        expect(Array.from(m.getStatementIndexesWithParticipation("r2")))
            .to.deep.equal([2, 3])
        expect(Array.from(m.getStatementIndexesWithParticipation("r3")))
            .to.deep.equal([3])
        expect(Array.from(m.getStatementIndexesWithParticipation("r4")))
            .to.deep.equal([4, 5])

        expect(Array.from(m.getStatementIndexesWithParticipation("does not exist")))
            .to.deep.equal([])
    });

    it("can rename the column of a table", () => {
        const m = new CodeManager({LOAD: 1, ADD: 1});
        const code = `
                    LOAD r1, [[1, 2], [2, 3], [3, 4]](x, y)
                    LOAD r2, 0
                    FOREACH r1
                        ADD ^r2, r1.x
                    ENDEACH                              
                `;

        m.addCodeString(code);

        expect(m.renameTableColumn("r1", "x", "a")).to.equal(true);

        expect(Parser.parseLine(m.code[0])).to.deep.equal([
            T_OPCODE("LOAD"),
            T_REGISTER("r1"),
            T_TABLE(["a", "y"], T_ARRAY_N(1, 2), T_ARRAY_N(2, 3), T_ARRAY_N(3, 4))
        ]);

        expect(Parser.parseLine(m.code[3])).to.deep.equal([
            T_OPCODE("ADD"),
            T_NONLOCAL_REGISTER("r2"),
            T_REGISTER("r1.a")
        ])

    });
});