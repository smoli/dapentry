import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";

describe('Add', () => {

    it('Adds the value of two registers and write the result into a register', async () => {
        const program = `
            LOAD r1 10
            LOAD r2 20            
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        //
        // expect(i.getRegister("r3")).to.equal(30);
    });
});
