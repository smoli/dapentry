import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/runtime/interpreter/Interpreter";
import exp = require("constants");


describe('FOREACH', () => {

    it('iterates over arrays', async () => {

        const code = `
            LOAD r1, 0
            FOREACH v, f1
            LOG v
            ADD ^r1, v
            ENDEACH
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3, 4, 5]
        });

        expect(i.getRegister("r1")).to.equal(1 + 2+ 3+ 4 + 5);


    });

    it('if not given an extra iterator register creates one with the same name', async () => {

        const code = `
            LOAD r1, 0
            FOREACH f1
            ADD ^r1, f1
            ENDEACH
        `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3, 4, 5]
        });

        expect(i.getRegister("r1")).to.equal(1 + 2+ 3+ 4 + 5);

    });

    it("work with nested foreachs on the same list", async () => {
        /*
        RECTPP Rectangle1,$styles.default,Canvas@topLeft,Canvas@bottomRight
        SCALE Rectangle1, width, 1, "left"
        FOREACH corner
        LINEPP Line1,$styles.default,Rectangle1@center,Rectangle1@right
            MOVETO Rectangle1@bottomLeft,Rectangle1@bottomRight
            DO 4
                POLY Polygon1, $styles.default, [ Line1@end ], 1
                ROTATE Line1, (360 / 4), Line1@start
            ENDDO
        ENDEACH
         */


        const code = `
            LOAD r1, 0
            FOREACH f1
                LOAD r2, 0
                FOREACH f1
                    ADD ^r2, f1
                ENDEACH
                ADD ^r1, r2
                ADD ^r1, f1
            ENDEACH
        `
        // const code = `
        //     LOAD r1, 0
        //     FOREACH i1, f1
        //         LOAD r2, 0
        //         FOREACH i1, f1
        //             ADD ^r2, i1
        //         ENDEACH
        //         ADD ^r1, r2
        //         ADD ^r1, i1
        //     ENDEACH
        // `

        const i = new Interpreter();
        i.parse(code);
        await i.run({
            f1: [1, 2, 3]
        });

        expect(i.getRegister("r1")).to.equal(4 * (1 + 2 + 3));

    });
});