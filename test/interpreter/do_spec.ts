import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";


describe('DO', () => {

    it('repeats a given number of times', async () => {

        const code = `
            LOAD r1, 0
            DO i, 10
            ADD ^r1, i
            ENDDO
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)
    });


    it('times can be given by a register', async () => {

        const code = `
            LOAD r1, 0
            LOAD max, 10
            DO i, max
            ADD ^r1, i
            ENDDO
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)
    });

    it('times can be given by an expression', async () => {

        const code = `
            LOAD r1, 0
            LOAD max, 5
            DO i, max * 2
            ADD ^r1, i
            ENDDO
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)
    });

    it("does not need a register to put the index in", async () => {
        const code = `
            LOAD r1, 0
            DO 10
            ADD ^r1, 1
            ENDDO
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10)
    });

    it("can be nested", async () => {
       const code = `
            LOAD r1, 0
            DO 3
                LOAD r2, 0
                DO 4
                    ADD ^r2, 1
                ENDDO
                ADD ^r1, r2
            ENDDO
       `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(12)


    });
});