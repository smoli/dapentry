import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";


describe('Point2', () => {

    it("can be used as data in a program", async () => {

        const code = `
            LOAD r1 ( 100 200 )
            LOAD r2 50
            LOAD r3 ( r2 40 )
            LOAD r3.y r1.x
        `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("r1").x).to.equal(100, "r1.x");
        expect(i.getRegister("r1").y).to.equal(200, "r1.y");
        expect(i.getRegister("r3").x).to.equal(50, "r3.x");
        expect(i.getRegister("r3").y).to.equal(100, "r3.y");
    })
});