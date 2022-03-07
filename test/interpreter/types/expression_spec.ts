import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/runtime/interpreter/Interpreter";
import exp = require("constants");


describe('Code can have expressions', () => {

    it('their result can be assigned to a register', async () => {

        const code = `
                LOAD r1, 2 + 4 * 5
            `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r1")).to.equal(22);

    });

    it("they can use registers for computation", async () => {

        const code = `
            LOAD r1, 2
            LOAD r-2, 4
            LOAD r3, r1 + r-2
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r3")).to.equal(6);
    })

    it("they cannot use stuff that is not a number or a register", async () => {
        // TODO: This is not enough security!
        const code = `
            LOAD r1, 2
            LOAD r2, 2
            LOAD r3,  r1 + r2 + fetch 
        `;

        const i = new Interpreter();
        i.parse(code);
        expect(() => {
            i.run();
        }).to.throw;

    });

    it("they can also use components of registers", async () => {
        const code = `
            LOAD r1, ( 2 * 4, 20 )
            LOAD r2, r1.x + r1.y
        `;

        const i = new Interpreter();
        i.parse(code);
        await i.run();

        expect(i.getRegister("r2")).to.equal(28);
    });

    it("can also use predefined mathematical functions", async () => {

        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7, 8]
            LOAD b, [1, 2, 3, 4, 5, 6, 7]
            LOAD max, max(a)
            LOAD min, min(a)
            LOAD avg, avg(a)
            LOAD medA, median(a)
            LOAD medB, median(b)
            LOAD sizeA, size(a)
            LOAD sizeB, size(b)
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("max")).to.equal(8);
        expect(i.getRegister("min")).to.equal(1);
        expect(i.getRegister("avg")).to.equal((1 + 2 + 3 + 4 + 5 + 6 + 7 + 8) / 8);
        expect(i.getRegister("medA")).to.equal(4.5);
        expect(i.getRegister("medB")).to.equal(4);
        expect(i.getRegister("sizeA")).to.equal(8);
        expect(i.getRegister("sizeB")).to.equal(7);
    })

    it("mathematical functions can be parts of bigger expressions", async () => {

        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7, 8]
            LOAD c, 1 / max(a)
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("c")).to.equal(1 / 8);
    })

    it("mathematical functions can be used on array iterators as well", async () => {

        const code = `
            LOAD a, [1, 2, 3, 4, 5, 6, 7, 8]
            ITER i, a
            LOAD c, 1 / max(i)
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("c")).to.equal(1 / 8);
    });

    it("mathematical functions can be used on table columns", async () => {
        const code = `
            LOAD t, [[1, 2], [2, 3], [3, 4]](x, y)
            LOAD m, max(t.x)
        `
        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("m")).to.equal(3);
    });

    it("size can be used on the table itself", async () => {
        const code = `
            LOAD t, [[1, 2], [2, 3], [3, 4]](x, y)
            LOAD s, size(t)
        `
        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("s")).to.equal(3);
    });

    it("mathematical functions can be used on an iterator that points to a table", async () => {
        const code = `
            LOAD t, [[1, 2], [2, 3], [3, 4]](x, y)
            ITER i, t
            LOAD m, max(i.y)
        `
        const i = new Interpreter();
        i.parse(code);
        await i.run();
        expect(i.getRegister("m")).to.equal(4);
    });

});