import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";
import exp = require("constants");


describe('FOREACH', () => {

    it('iterates over arrays', async () => {

        const code = `
            LOAD r1, 0
            FOREACH v, f1
            ADD ^r1, v
            ENDEACH
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3, 4, 5]
        });

        expect(i.getRegister("r1")).to.equal(1 + 2+ 3+ 4 + 5);


    });

    it('if not given an extra iterator register creates one with the same name', async () => {

        const code = `
            LOAD r1, 0
            FOREACH f1
            ADD ^r1, f1
            ENDEACH
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3, 4, 5]
        });

        expect(i.getRegister("r1")).to.equal(1 + 2+ 3+ 4 + 5);

    });
});