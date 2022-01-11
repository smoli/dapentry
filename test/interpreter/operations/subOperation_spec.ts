import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";

describe('Sub', () => {

    it('Subtracts the value of two registers and writes the result into a register', async () => {
        const program = `
            LOAD r1, 10
            LOAD r2, 20          
            SUB  r3, r1, r2  
            
            SUB  r2, 10
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r3")).to.equal(-10);
        expect(i.getRegister("r2")).to.equal(10);
    });
});
