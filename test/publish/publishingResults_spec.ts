import {describe, it} from "mocha";
import {JSPublisher} from "../../src/publish/JSPublisher";
import {expect} from "chai";

import * as library from "../../src/publish/library";
import {GrCanvas} from "../../src/geometry/GrCanvas";
import {ObjectType} from "../../src/geometry/GrObject";
const canvas = GrCanvas.create_1_1(1000);

describe('A published drawing', () => {

    it('works', () => {
        const code = `RECTPP Rectangle1,$styles.default,Canvas@center,Canvas@topRight`;
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Rectangle1"]);

        console.log(jsCode.join("\n"))

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);

        const rect:library.Rectangle = r[0];

        expect(rect.width).to.equal(500);
        expect(rect.height).to.equal(500);
        expect(rect.center).to.deep.equal({ x: 750, y: 250 });
    });

    it("works for loops as well", () => {

        const code = `
        DO 4
        RECTBL Rectangle1,$styles.default,Canvas@center,150, 100
        ENDDO
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Rectangle1"]);

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
    });
});