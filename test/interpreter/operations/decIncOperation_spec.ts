import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";

describe('Dec', () => {

    it('Subtracts one from a register and writes it back', async () => {
        const program = `
            LOAD r1 10
            DEC  r1    
            DEC  r1
            DEC  r1
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r1")).to.equal(7);
    });
});

describe('Inc', () => {

    it('Adds one to a register and writes it back', async () => {
        const program = `
            LOAD r1 10
            INC  r1    
            INC  r1
            INC  r1
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r1")).to.equal(13);
    });
});
