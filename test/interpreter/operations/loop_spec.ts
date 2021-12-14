import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";


describe('Loop', () => {

    xit('can do...', async () => {

        const code = `
            LOAD r1 10
            LOAD r2 0
            LABEL:
            ADD  r2 10
            SUB  r1 1
            JNZ  r1 LABEL
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(100);

    });
});