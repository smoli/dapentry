import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('Halt', () => {

    it('ends the program', async () => {

        const code = `
            LOAD r1 100
            CALL r1 FUNC
            ADD r1 5
            HALT
            ADD r1 5
            
          FUNC:
            ADD r1 10
            RET r1
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(115);

    });
});