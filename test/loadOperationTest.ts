import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../src/Interpreter";


describe('Load', () => {

    it('load a value into a register', async () => {
        const program = `
            LOAD r1 "Hello World"
            LOAD r2 1234            
            LOAD r3 "Hello World"
            LOAD r4 1234            
            LOAD r5 "Hello World"
            LOAD r6 1234            
        `;

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(i.getRegister("r1")).to.equal("Hello World");
        expect(i.getRegister("r2")).to.equal(1234);
        expect(i.getRegister("r3")).to.equal("Hello World");
        expect(i.getRegister("r4")).to.equal(1234);
        expect(i.getRegister("r5")).to.equal("Hello World");
        expect(i.getRegister("r6")).to.equal(1234);
    });
});