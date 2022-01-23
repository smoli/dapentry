import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";


describe('Call and Return', () => {

    it("can receive arguments", async () => {

        let code = `
                LOAD r1, 100
                CALL r2, SUBBER:, r1, 1
                CALL r2, SUBBER:, r2, 2
                CALL r2, SUBBER:, r2, 3
                CALL r2, SUBBER:, r2, 4
                CALL r2, SUBBER:, r2, 5
                HALT
                
             SUBBER: a, b      
                SUB a, b
                RET a                             
        `;


        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(100);
        expect(i.getRegister("r2")).to.equal(100 - 1 - 2 - 3 - 4 - 5);
    });

    it("do not need a receiver", async () => {

        let code = `
            
            CALL SUBBER:, 100, 1     #Useless but valid
            HALT
            
            SUBBER: a, b
                SUB a, b
                RET a
            
        `;

        const i = new Interpreter();
        i.parse(code);
        expect(async () => {
            await i.run();
        }).to.be.ok;
    });

    it("expects regular registers as arguments in function declarations", async () => {
        let code = `
                LOAD r1, 100
                CALL r2, SUBBER:, r1, 5
                HALT
                
             SUBBER: ^a, b  # Nonlocal registers make no sense      
                SUB a, b
                RET a                             
        `;


        const i = new Interpreter();
        expect(() => {
            i.parse(code);
        }).to.throw;


        code = `
                LOAD r1, 100
                CALL r2, SUBBER:, r1, 5
                HALT
                
             SUBBER: 12, b  # Literals make no sense      
                SUB a, b
                RET a                             
        `;

        expect(() => {
            i.parse(code);
        }).to.throw;


    });



    it("enable us to implement functions", async () => {

        const code = `
                LOAD r1, 100
                CALL r1, FUNC:                
                CALL r1, FUNC:                
                CALL r1, FUNC:               
                CALL r3, FUNC:               
                HALT
                
             FUNC:
                LOAD local, 0
                ADD local, r1
                INC local                
                RET local                             
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(103);
        expect(i.getRegister("r3")).to.equal(104);
    });

    it("allow for recursion", async () => {
        const code = `
            
            LOAD r1, 5
            CALL res, FIB: 
            HALT
            
            FIB:
                JEQ r1, 0, ZERO:
                JEQ r1, 1, ONE:
                JMP ELSE:
            
                ZERO:
                    LOAD r2, 0
                    RET r2
                    
                ONE:
                    LOAD r2, 1
                    RET r2
          
                ELSE:                    
                    DEC r1
                    CALL r3, FIB:
                    
                    DEC r1
                    CALL r4, FIB:
                    
                    ADD r3, r4
                    RET r3
        
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        function fib(n) {
            if (n === 0) return 0;
            if (n === 1) return 1;
            return fib(n - 1) + fib(n - 2);
        }

        expect(i.getRegister("res")).to.equal(fib(5));
        expect(i.getRegister("r1")).to.equal(5);
    })

});
