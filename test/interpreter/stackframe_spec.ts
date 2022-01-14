import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";


describe('Stackframes', () => {

    it('enable us to setup execution contexts', async () => {

        const code = `
            LOAD r1, 10
            LOAD r2, 10
            PUSHSF
            DEC r1
            ADD r1, r2
            POPSF            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10);

    });

    it("allow us to reference registers from the outside scope by prefixing a register with ^", async () => {

        const code = `
            LOAD r1, 10
            LOAD r2, 10
            PUSHSF
            DEC ^r1
            ADD ^r1, r2
            POPSF            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(19);
    });

    it("access to outside scope looks up the hierarchy only once", async () => {

        const code = `
            LOAD r1, 10
            LOAD r2, 10
            PUSHSF          
            PUSHSF
            DEC ^r1
            ADD ^r1, r2
            POPSF 
            POPSF           
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10);
    });


});