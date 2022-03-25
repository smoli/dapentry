import {describe, it} from "mocha";
import {JSPublisher} from "../../src/publish/JSPublisher";
import {expect} from "chai";

import * as library from "../../src/publish/library";
import {GrCanvas} from "../../src/geometry/GrCanvas";
import {ObjectType} from "../../src/geometry/GrObject";
import {DataFieldType} from "../../src/state/modules/Data";

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
        expect(r[0].objects.length).to.equal(4);
    });


    it("works for loops that refer a field as well", () => {
        const code = `
        DO x
            RECTBL Rectangle1,$styles.default,Canvas@center,150, 100
        ENDDO
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [{
            name: "x",
            value: "7",
            type: DataFieldType.Number,
            description: "lkjh",
            published: false
        }], ["Rectangle1"]);

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(7);
    });

    it("works for forEach that refer a list as well", () => {
        const code = `
        FOREACH x
            RECTBL Rectangle1,$styles.default,Canvas@center, x, 100
        ENDEACH
        `
        const jsCode = JSPublisher.getDrawingFunctionBody(code, [{
            name: "x",
            value: [100, 200, 300],
            type: DataFieldType.List,
            description: "lkjh",
            published: false
        }], ["Rectangle1"]);

        console.log(jsCode.join("\n"))

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(3);

        expect(r[0].objects[0].width).to.equal(100);
        expect(r[0].objects[1].width).to.equal(200);
        expect(r[0].objects[2].width).to.equal(300);


    });
});