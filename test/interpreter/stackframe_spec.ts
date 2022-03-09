import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";
import {StackFrame} from "../../src/runtime/interpreter/StackFrame";


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

    it("can be asked if a register exists", () => {

        const sf = new StackFrame();

        expect(sf.hasRegister("f1")).to.be.false;

        sf.setRegister("f1", 1);
        expect(sf.hasRegister("f1")).to.be.true;

    });

    it("can be asked if a register exists on itself or its parent hierarchy", () => {

        const sf1 = new StackFrame();
        const sf2 = new StackFrame(sf1);
        const sf3 = new StackFrame(sf2);

        expect(sf3.hasRegister("f1", true)).to.be.false;

        sf1.setRegister("f1", 1);
        expect(sf3.hasRegister("f1", true)).to.be.true;

    });


});