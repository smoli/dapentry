import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('at-access', () => {

    class AtTester {
        at(where) {
            return "At(" + where + ")";
        }
    }

    it('can invoke a method at on register values to receive a value', async () => {
        const code = `
            LOAD r1, test@12
            LOAD r2, test@hello             
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            test: new AtTester()
        });

        expect(i.getRegister("r1")).to.equal("At(12)")
        expect(i.getRegister("r2")).to.equal("At(hello)")

    });
});