import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('Array', () => {

    it("can be used as data in a program", async () => {

        const code = `
            LOAD v, 500
            LOAD r1, [100, 200, 300, 400, v]
            LOAD r1.1, 150
            LOAD r2, r1.2
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1").length).to.equal(5);
        expect(i.getRegister("r1")[1]).to.equal(150);
        expect(i.getRegister("r1")[4]).to.equal(500);
        expect(i.getRegister("r2")).to.equal(300);

    });

    it("can be initialized empty", async () => {
        const code = `
                LOAD r1, [ ]
        `
        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(Array.isArray(i.getRegister("r1"))).to.be.true;

    });

    it("can have items added to it", async () => {
        const code = `
            LOAD r1, [100, 200, 300, 400]
            LOAD r2, 500
            APP r1, r2
            APP r1, 550
            APP r1, 600, 650                        
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.deep.equal([100, 200, 300, 400, 500, 550, 600, 650])
    });

    it("can be iterated over", async () => {
        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7]
            LOAD r, 0
                        
            ITER i, a
          LABEL:
            ADD r, i.value
            JEQ i.index, 5, END:
            NEXT i
            JINE i, LABEL:
            
          END:
            MUL r, 2                 
       `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("r")).to.equal(2 * (1 + 2 + 3 + 4 + 5 + 6))

    });

    it("passed into the interpreter", async () => {
        const code = `
            LOAD r, 0
                        
            ITER i, a
          LABEL:
            ADD r, i.value
            JEQ i.index, 5, END:
            NEXT i
            JINE i, LABEL:
          END:
            MUL r, 2                 
       `;

        const i = new Interpreter();
        i.parse(code);

        await i.run({
            a: [1, 2, 3, 4, 5, 6, 7]
        });

        expect(i.getRegister("r")).to.equal(2 * (1 + 2 + 3 + 4 + 5 + 6))

    });

    it("iterator value in point", async () => {
        const code = `
            LOAD ar, [1, 2, 3]
            
            ITER i, ar
           LOOP:
            LOAD r1, (i.value, 1)
            LOAD r2, i.value
            NEXT i
            JINE i, LOOP:
            
        `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("r1").x).to.equal(3)
        expect(i.getRegister("r2")).to.equal(3)

    });

    it("can be iterated over with special operations", async () => {

        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7]
            LOAD r, 0
                                        
            FOREACH v, a  
                ADD ^r, v
            ENDEACH          
       `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("r")).to.equal((1 + 2 + 3 + 4 + 5 + 6 + 7))
        expect(i.getRegister("a")).to.deep.equal([1, 2, 3, 4, 5, 6, 7])
        expect(i.getRegister("v")).to.equal(7)
    });

    it("iteration is provided the index as well", async () => {

        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7]
            LOAD r, 0
                                        
            FOREACH v, i, a 
                MUL t, v, i 
                ADD ^r, t
            ENDEACH          
       `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();
                     // actually 0 * 1 + 1 * 2 + 2 * 3 + 3 * 4 + 4 * 5 + 5 * 6 + 6 * 7
        expect(i.getRegister("r")).to.equal((2 + 2 * 3 + 3 * 4 + 4 * 5 + 5 * 6 + 6 * 7))
    });
});
