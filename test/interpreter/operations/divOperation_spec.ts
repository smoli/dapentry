import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";

describe('Divide', () => {

    it('Divides the value of two registers and writes the result into a register', async () => {
        const program = `
            LOAD r1 10
            LOAD r2 20  
            DIV  r3 r1 r2    
            
            DIV  r2 10      
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r3")).to.equal(0.5);
        expect(i.getRegister("r2")).to.equal(2);
    });
});
