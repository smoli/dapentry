import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/interpreter/Interpreter";


describe('Stackframes', () => {

    it('enable us to setup execution contexts', async () => {

        const code = `
            LOAD r1 10
            LOAD r2 10
            PUSHSF
            DEC r1
            ADD r1 r2
            POPSF            
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10);

    });

    it('popping can write one register value from the popped ' +
        'to the parent frame, kind of a return', async () => {

        const code = `
            LOAD r1 10
            LOAD r2 10
            PUSHSF
            DEC r1
            ADD r3 r2 r1
            POPSF r3     
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(10);
        expect(i.getRegister("r3")).to.equal(19);

    })

    xit("enable us to do recursion", async () => {

        const code = `
                PUSH r1 5                
            FIB:
                PUSHSF
                JEQ r1 1 ONE
                JEQ r1 2 TWO
                JMP ELSE    
            ONE:
                ADD r2 1
                JMP NEXT
                
            TWO:
                ADD r2 2
                JMP NEXT
            
            ELSE:
                
                
                
        `


    });

});