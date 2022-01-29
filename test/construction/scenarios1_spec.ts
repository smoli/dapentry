import {describe, it} from "mocha";
import {expect} from "chai"
import {GfxInterpreter} from "../../src/GfxInterpreter";
import {StyleManager} from "../../src/controls/drawing/Objects/StyleManager";
import {runCode} from "../interpreter/toolRunCode";
import {GrObjectList} from "../../src/Geo/GrObjectList";
import exp = require("constants");


describe('Scenarios 1', () => {

    it('Stacking by looping and moving object on themselves', async () => {

        const code = `
            DO 3
                RECT Rectangle1, $styles.default, (100, 100), 100, 50
                MOVE Rectangle1@bottom, Rectangle1@top
            ENDDO
        `;

            const i = await runCode(code);

            const rects = i.getRegister("Rectangle1");

            expect(rects).to.be.instanceof(GrObjectList);
            expect(rects.objects.length).to.equal(3);
            expect(rects.objects[0].center).to.deep.equal({ x: 100, y: 100 });
            expect(rects.objects[1].center).to.deep.equal({ x: 100, y: 50 });
            expect(rects.objects[2].center).to.deep.equal({ x: 100, y: 0 });
    });
    
});