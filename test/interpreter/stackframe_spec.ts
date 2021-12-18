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
                LOAD bx 5                
            FACT:
                PUSHSF
                JGT bx 1 COMPUTE
                
            BACKFACT:                
                LOAD r1                             
            RET:
                POPSF r1 
                JMP END
                
            COMPUTE:
                PUSHSF
                DEC bx
                JMP FACT
                MUL r2 r1                               
                POPSF r2
                JMP BACKFACT
              
            END:
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(1);
        // @ts-ignore
        console.log(i._stack)


    });

});