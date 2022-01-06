import {describe, it} from "mocha";
import {expect} from "chai"
const sinon = require("sinon")

import {Interpreter} from "../../src/runtime/interpreter/Interpreter";

describe('Interpreter', () => {

    it('can run a simple program', () => {
        const code = `               
            LOG "Hello World"
                                    
        `;

        const log = sinon.spy(console, "log")

        const i = new Interpreter();
        i.parse(code);
        i.run();

        expect(log.args[0][0]).to.equal('Hello World');

        // @ts-ignore
        console.log.restore();
    });

    it('can take an array of strings as a program', async () => {
       const code = ['LOAD r1 100', 'ADD r1 10'];

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(110);

    });

    it("can receive values to preload registers", async ()=> {
       const code = `
            ADD r2 r1 100
       `;

        const i = new Interpreter();
        i.parse(code);
        await i.run({ r1: 100 });

        expect(i.getRegister("r1")).to.equal(100);
        expect(i.getRegister("r2")).to.equal(200);

    });

    it('programs have access to the program counter', async () => {


        const code = `
                LOAD r1 200  # 0
                LOAD r2 pc   # 1
                DEC r1       # 2
                SETPC 5      # 3  will affect pc before it is incremented               
                DEC r1       # 4                  
                DEC r1       # 5
                LOAD r3 pc   # 6                      
        `;


        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(199)
        expect(i.getRegister("r2")).to.equal(1)
        expect(i.getRegister("r3")).to.equal(6)

    });

    it("ignores annotations in code", async () => {
       const code = `
                LOAD r1 200  @A1
                LOAD r2 pc   @lkjh @lkjh 
                DEC r1       @KJHGlkj123
       `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(199);
        expect(i.getRegister("r2")).to.equal(1)

    });

});