import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('Code can have expressions', () => {

    it('their result can be assigned to a register', async () => {

        const code = `
                LOAD r1 2 + 4 * 5
            `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(22);

    });

    it("they can use registers for computation", async () => {

        const code = `
            LOAD r1 2
            LOAD r-2 4
            LOAD r3 r1 + r-2
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r3")).to.equal(6);
    })

    it("they cannot use stuff that is not a number or a register", async () => {
        // TODO: This is not enough security!
        const code = `
            LOAD r1 2
            LOAD r2 2
            LOAD r3  r1 + r2 fetch(r1) 
        `;

        const i = new Interpreter();
        i.parse(code);
        expect(() => {
            i.run();
        }).to.throw;
    });

    it("they can also use components of registers", async () => {
        const code = `
            LOAD r1 ( 2 * 4 20 )
            LOAD r2 r1.x + r1.y
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(28);
    });
});