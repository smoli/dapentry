import {describe, it} from "mocha";
import {JSPublisher} from "../../src/publish/JSPublisher";
import {expect} from "chai";

import * as library from "../../src/publish/library";
import {GrCanvas} from "../../src/geometry/GrCanvas";
import {ObjectType} from "../../src/geometry/GrObject";
import {DataField, DataFieldType} from "../../src/state/modules/Data";

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

    it("can handle expression in data and steps", () => {
        const code = `
            RECTPP Rectangle3,$styles.default,Canvas@topLeft,Canvas@bottomRight
            SCALE Rectangle3, width, 1, "left"
            FOREACH data
            RECTPP Rectangle4,$styles.default,Rectangle3@topLeft,Rectangle3@bottomRight
            SCALE Rectangle4, 1, data * ratio, "bottom"
            MOVETO Rectangle3@bottomLeft,Rectangle3@bottomRight
            ENDEACH        
        `;

        const fields: Array<DataField> = [{
            name: "data", type: DataFieldType.List, published: false, description: "",
            value: [10, 20, 30, 40, 50]
        }, {
            name: "width", type: DataFieldType.String, published: false, description: "",
            value: "1 / size(data)"
        }, {
            name: "ratio", type: DataFieldType.String, published: false, description: "",
            value: "1 / max(data)"
        }
        ];

        const jsCode = JSPublisher.getDrawingFunctionBody(code, fields, ["Rectangle4"]);

        const drawing = new Function("dapentry", "__canvas", jsCode.join("\n"));

        const r = drawing(library, canvas);

        expect(r.length).to.equal(1);
        expect(r[0].type).to.equal(ObjectType.List);
        expect(r[0].objects.length).to.equal(5);

        expect(r[0].objects[0].width).to.equal(200);
        expect(r[0].objects[0].height).to.equal(1000 / 50 * 10);
        expect(r[0].objects[1].width).to.equal(200);
        expect(r[0].objects[1].height).to.equal(1000 / 50 * 20);
        expect(r[0].objects[2].width).to.equal(200);
        expect(r[0].objects[2].height).to.equal(1000 / 50 * 30);
        expect(r[0].objects[3].width).to.equal(200);
        expect(r[0].objects[3].height).to.equal(1000 / 50 * 40);
        expect(r[0].objects[4].width).to.equal(200);
        expect(r[0].objects[4].height).to.equal(1000 / 50 * 50);


    })
});