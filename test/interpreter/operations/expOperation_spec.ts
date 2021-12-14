import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";

describe('Exponentiante', () => {

    it('Exponentiates the value of two registers and writes the result into a register', async () => {
        const program = `
            LOAD r1 2
            LOAD r2 8  
            EXP  r3 r1 r2          
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r3")).to.equal(2 ** 8);
    });
});
