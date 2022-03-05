import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";


describe('Table', () => {

    it("has rows and column names", async () => {

        const code = `
            LOAD t, [[1, 2], [2, 3], [3, 4]](x, y)
        `

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("t")).to.deep.equal([
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 4 },
            ]
        );
    });

    it("can be iterated over with foreach", async () => {

        const code = `
            LOAD a, [[1, 2, 23], [2, 3, 4], [3, 4, 5]](x, y, z)
            LOAD x, 0
            LOAD y, 0
            LOAD z, 0
                                        
            FOREACH v, a  
                ADD ^x, v.x
            ENDEACH          

            FOREACH v, a  
                ADD ^y, v.y
            ENDEACH          

            FOREACH v, a  
                ADD ^z, v.z
            ENDEACH          

       `;

        const i = new Interpreter();
        i.parse(code);

        await i.run();

        expect(i.getRegister("x")).to.equal(( 1 + 2 + 3 ))
        expect(i.getRegister("y")).to.equal(( 2 + 3 + 4))
        expect(i.getRegister("z")).to.equal(( 23 + 4 + 5))
    });
});