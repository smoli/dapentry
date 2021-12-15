import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";


describe('Loops are done using jumps', () => {

    it('e.g after testing for zero', async () => {

        const code = `
            LOAD r1 10      # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            DEC  r1         # Decrement loop counter
            JNZ  r1 LABEL   # As long as loop counter is not zero jump            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(100);

    });


    it('e.g after testing for inequality', async () => {

        const code = `
            LOAD r1 10      # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            DEC  r1         # Decrement loop counter
            JNE  r1 5 LABEL   # As long as loop counter is not 5            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(50);

    });


    it('e.g after testing for lower', async () => {

        const code = `
            LOAD r1 0       # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            INC  r1         # Increment loop counter
            JLT  r1 5 LABEL # As long as loop counter is lower than 5            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(50);

    });

    it('e.g after testing for lower equal', async () => {

        const code = `
            LOAD r1 0       # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            INC  r1         # Increment loop counter
            JLE  r1 5 LABEL # As long as loop counter is lower or equal to 5            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(60);

    });


    it('e.g after testing for greater', async () => {

        const code = `
            LOAD r1 10       # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            DEC  r1         # Decrement loop counter
            JGT  r1 5 LABEL # As long as loop counter is greater than 5            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(50);

    });

    it('e.g after testing for greater equal', async () => {

        const code = `
            LOAD r1 10       # Loop counter
            LOAD r2 0       # Initial value
        LABEL:
            ADD  r2 r2 10   # Increment value
            DEC  r1         # Decrement loop counter
            JGE  r1 5 LABEL # As long as loop counter is greater or equal to 5            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(60);

    });

    it('jumping to a non existent label will throw an error', async () => {

        const code = `
            LOAD r1 10      
            LOAD r2 0       
        LABEL:
            ADD  r2 r2 10   
            DEC  r1         
            JNZ  r1 WRONGLABEL            
        `;

        const i = new Interpreter();
        i.parse(code);
        expect(() => {
            i.run();
        }).to.throw;

    });
});