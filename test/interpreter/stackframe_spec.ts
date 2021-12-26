import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/interpreter/Interpreter";


describe('Stackframes', () => {

    it('enable us to setup execution contexts', async () => {

        const code = `
            LOAD r1 10
            LOAD r2 10
            PUSHSF
            DEC r1
            ADD r1 r2
            POPSF            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10);

    });


});