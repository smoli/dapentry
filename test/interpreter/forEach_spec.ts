import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";


describe('FOREACH', () => {

    it('iterates over arrays', async () => {

        const code = `
            FOREACH v, f1
            ADD r1, v1
            ENDEACH
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3, 4, 5]
        });


    });
});