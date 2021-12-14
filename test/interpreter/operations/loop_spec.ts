import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";


describe('Loop', () => {

    it('can do...', async () => {

        const code = `
            LOAD r1 10      # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            SUB  r1 r1 1    # Decrement loop counter
            JNZ  r1 LABEL   # As long as loop counter is not zero jump            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(100);

    });
});