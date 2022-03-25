import {describe, it} from "mocha";
import {JSPublisher} from "../../src/publish/JSPublisher";
import {AspectRatio} from "../../src/geometry/AspectRatio";
import {expect} from "chai";

import * as mockLib from "./mockLib";
import {GrCanvas} from "../../src/geometry/GrCanvas";


describe('A published drawing', () => {

    it('works', () => {
        const code = `RECTPP Rectangle1,$styles.default,Canvas@center,Canvas@topRight`;
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [], ["Rectangle1"]);

        console.log(jsCode.join("\n"))

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const canvas = GrCanvas.create_1_1(1000);
        const r = drawing(mockLib, canvas);

        expect(r.length).to.equal(1);

        const rect:mockLib.Rectangle = r[0];

        expect(rect.width).to.equal(500);
        expect(rect.height).to.equal(500);
        expect(rect.center).to.deep.equal({ x: 750, y: 250 });
    });
});