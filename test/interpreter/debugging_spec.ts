import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";


describe('Debugging', () => {

    it('can be used to stop and resume program execution', async () => {

        const code = `
            LOAD r1 10
            DEC r1            
            DEBUG
            DEC r1            
            DEC r1            
            DEC r1            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        // Program runs until DEBUG statement
        expect(i.getRegister("r1")).to.equal(9);

        await i.resume();

        // Program runs til end
        expect(i.getRegister("r1")).to.equal(6);
    });

    it('a stopped program can be restarted', async () => {

        const code = `
            LOAD r1 10
            DEC r1            
            DEBUG
            DEC r1            
            DEC r1            
            DEC r1            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        // Program runs until DEBUG statement
        expect(i.getRegister("r1")).to.equal(9);

        await i.run();

        // Program runs until DEBUG statement
        expect(i.getRegister("r1")).to.equal(9);

        await i.resume();

        // Program runs til end
        expect(i.getRegister("r1")).to.equal(6);
    });

});