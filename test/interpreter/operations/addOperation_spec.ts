import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";

describe('Add', () => {

    it('Adds the value of two registers and writes the result into a register', async () => {
        const program = `
            LOAD r1 10
            LOAD r2 20  
            ADD  r3 r1 r2          
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r3")).to.equal(30);
    });

    it('Adds a value to a register and stores the sum in that register if given two args', async () => {
        const program = `
            LOAD r1 10
            LOAD r2 20  
            ADD  r1 r2          
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r1")).to.equal(30);

    });

    it("concatenates strings", async () => {

        const code = `
            LOAD a "Hello "
            LOAD b "world!"
            ADD  a b
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("a")).to.equal("Hello world!");

    })
});
