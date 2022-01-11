import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('Jumps', () => {

    it('are used to jump to a label unconditionally', async () => {

        const code = `
            LOAD r1, 10      
            JMP LABEL                   
            INC  r1
        LABEL:            
            INC r1          
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(11);

    });

});