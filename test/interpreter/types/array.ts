import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";


describe('Array', () => {

    it("can be used as data in a program", async () => {

        const code = `
            LOAD v 500
            LOAD r1 [100 200 300 400 v]
            LOAD r1.1 150
            LOAD r2 r1.2
        `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("r1").length).to.equal(5);
        expect(i.getRegister("r1")[1]).to.equal(150);
        expect(i.getRegister("r2")).to.equal(300);
    })
});